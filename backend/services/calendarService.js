const axios = require('axios');
const pool = require('../config/db');
const clientService = require('./clientService');
const deliverableRepository = require('../repositories/deliverableRepository');
const notificationRepository = require('../repositories/notificationRepository');
const dashboardRepository = require('../repositories/dashboardRepository');
const { generateNextActivityCode } = require('../utils/activityCodeHelper');
const onesignalService = require('./onesignalService');
const notificationService = require('./notificationService');
// Helper to slugify client names for email creation
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start
    .replace(/-+$/, ''); // Trim - from end
}

// Helper to detect if a value represents a date or day of the month
function isDateString(val, totalRowsCount) {
  if (!val) return false;
  const str = val.toString().trim();
  const num = parseInt(str, 10);
  if (!isNaN(num) && num >= 1 && num <= 31 && /^\d{1,2}$/.test(str)) {
    return true;
  }
  if (/^\d{1,2}\s+[a-zA-Z]+,?\s+\d{4}$/.test(str)) return true;
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return true;
  if (/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}$/.test(str)) return true;
  
  const parsed = Date.parse(str);
  if (!isNaN(parsed) && str.length > 5 && (str.includes('/') || str.includes('-') || str.includes(' '))) {
    return true;
  }
  return false;
}

// RFC 4180 compliant CSV Parser
function parseCSV(csvText) {
  const lines = [];
  let row = [""];
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          row[row.length - 1] += '"';
          i++; // Skip next quote
        } else {
          inQuotes = false;
        }
      } else {
        row[row.length - 1] += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        row.push("");
      } else if (char === '\r' || char === '\n') {
        if (char === '\r' && nextChar === '\n') {
          i++;
        }
        lines.push(row);
        row = [""];
      } else {
        row[row.length - 1] += char;
      }
    }
  }
  if (row.length > 1 || row[0] !== "") {
    lines.push(row);
  }
  return lines;
}

// Helper to map spreadsheet row headers to active activity types
function mapRowToActivityQuantities(row, activityTypes) {
  const quantities = {};
  for (const key of Object.keys(row)) {
    const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (normalizedKey === 'clientname' || normalizedKey === 'postedday' || normalizedKey === 'date' || normalizedKey === 'day') continue;

    // 1. Try exact match to activity_type_code or activity_name
    const matchedType = activityTypes.find(at => 
      at.activity_type_code.toLowerCase() === normalizedKey ||
      at.activity_name.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedKey
    );

    if (matchedType) {
      quantities[matchedType.activity_type_code] = parseInt(row[key], 10) || 0;
    } else {
      // 2. Fallback to standard aliases
      let code = null;
      if (['post', 'posts', 'p', 'pposts', 'poster', 'posters'].includes(normalizedKey)) {
        code = 'AT001'; // Poster
      } else if (['reel', 'reels', 'r', 'rreels'].includes(normalizedKey)) {
        code = 'AT002'; // Reel
      } else if (['carousel', 'carosel', 'c', 'carousels', 'carosels'].includes(normalizedKey)) {
        code = 'AT003'; // Carousel
      } else if (['yts', 'shorts', 'youtubeshorts', 'ytsshorts', 'shortsandblogs', 'blog', 'blogs', 'b', 'article', 'articles'].includes(normalizedKey)) {
        code = 'AT004'; // Shorts and Blogs
      } else if (['yt', 'longform', 'youtubelong', 'long', 'ytlong', 'youtube'].includes(normalizedKey)) {
        code = 'AT005'; // Longform
      } else if (['event', 'events', 'eventday', 'eventdays', 'e'].includes(normalizedKey)) {
        code = 'AT006'; // Event Day
      } else if (['adshort', 'adshorts', 'ads', 'ad'].includes(normalizedKey)) {
        code = 'AT008'; // Ad Shorts
      }

      if (code) {
        quantities[code] = (quantities[code] || 0) + (parseInt(row[key], 10) || 0);
      }
    }
  }
  return quantities;
}

class CalendarService {
  // Proxy fetch Google Sheet as CSV and parse it
  async fetchAndParseGoogleSheets(url) {
    const sheetIdMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (!sheetIdMatch) {
      const error = new Error('Invalid Google Sheets URL format. Make sure it contains "/d/SPREADSHEET_ID"');
      error.statusCode = 400;
      throw error;
    }
    const sheetId = sheetIdMatch[1];
    const gidMatch = url.match(/gid=(\d+)/);
    const gid = gidMatch ? gidMatch[1] : '0';

    const exportUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
    
    try {
      const response = await axios.get(exportUrl);
      const parsedLines = parseCSV(response.data);
      if (parsedLines.length === 0) return [];

      // Find the header row (the first row containing 'client name' or 'client' in the first column)
      let headerIdx = -1;
      for (let i = 0; i < parsedLines.length; i++) {
        const firstCol = parsedLines[i][0] ? parsedLines[i][0].trim().toLowerCase() : '';
        if (firstCol.includes('client name') || firstCol === 'client' || firstCol === 'client_name') {
          headerIdx = i;
          break;
        }
      }

      if (headerIdx === -1) {
        headerIdx = 0; // Fallback to row 0
      }

      const headers = parsedLines[headerIdx].map(h => h.trim());
      const rows = [];

      for (let i = headerIdx + 1; i < parsedLines.length; i++) {
        const line = parsedLines[i];
        if (!line[0] || line[0].trim() === '' || line[0].toLowerCase().includes('client name') || line[0].toLowerCase() === 'client') {
          continue; // Skip headers or empty rows
        }

        const rowObj = {};
        headers.forEach((header, idx) => {
          if (header) {
            rowObj[header] = line[idx];
          }
        });

        // Map clientName for consistency
        rowObj.clientName = line[0].trim();
        rows.push(rowObj);
      }
      return rows;
    } catch (err) {
      console.error('Google Sheets fetch error:', err.message);
      const error = new Error('Failed to fetch or parse the Google Sheet. Please make sure the sheet is shared as "Anyone with the link can view".');
      error.statusCode = 400;
      throw error;
    }
  }

  // Unified Helper: Get Set of all off-days (Sundays + Custom Skipped Dates) for a month
  async getOffDaysSet(month, conn = null) {
    const db = conn || pool;
    const [skipRows] = await db.query(
      'SELECT DATE_FORMAT(date, "%Y-%m-%d") AS date_str FROM calendar_skip_dates WHERE month = ?',
      [month]
    );
    const offDaysSet = new Set(skipRows.map(r => r.date_str));

    const [yearStr, monthStr] = month.split('-');
    const year = parseInt(yearStr, 10);
    const monthInt = parseInt(monthStr, 10);
    const totalDays = new Date(Date.UTC(year, monthInt, 0)).getUTCDate();

    for (let d = 1; d <= totalDays; d++) {
      const dStr = `${month}-${String(d).padStart(2, '0')}`;
      const dt = new Date(Date.UTC(year, monthInt - 1, d));
      if (dt.getUTCDay() === 0) { // 0 = Sunday
        offDaysSet.add(dStr);
      }
    }

    return offDaysSet;
  }

  // Get skipped dates for a month
  async getSkipDates(month) {
    const [rows] = await pool.query(
      'SELECT DATE_FORMAT(date, "%Y-%m-%d") AS date_str, reason FROM calendar_skip_dates WHERE month = ? ORDER BY date ASC',
      [month]
    );
    return rows.map(r => r.date_str);
  }

  // Check if calendar is already approved/sent
  async assertCalendarNotApproved(month, conn = null) {
    const db = conn || pool;
    const [approvedCheck] = await db.query(
      "SELECT id FROM content_calendar WHERE month = ? AND status IN ('approved', 'sent_to_employees') LIMIT 1",
      [month]
    );
    if (approvedCheck.length > 0) {
      const error = new Error('This Content Calendar has already been approved and finalized. It cannot be edited.');
      error.statusCode = 400;
      throw error;
    }
  }

  // Save/update skipped dates for a month
  async saveSkipDates(month, skipDates, conn = null) {
    const db = conn || pool;
    await this.assertCalendarNotApproved(month, db);
    await db.query('DELETE FROM calendar_skip_dates WHERE month = ?', [month]);
    if (Array.isArray(skipDates) && skipDates.length > 0) {
      const uniqueDates = [...new Set(skipDates)].filter(Boolean);
      for (const dStr of uniqueDates) {
        if (/^\d{4}-\d{2}-\d{2}$/.test(dStr) && dStr.startsWith(month)) {
          await db.query(
            'INSERT INTO calendar_skip_dates (month, date, reason) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE reason=VALUES(reason)',
            [month, dStr, 'Admin Skipped Date']
          );
        }
      }
    }
    // Auto-shift any items currently on Sundays or newly skipped dates
    await this.shiftItemsOffHolidaysAndSkipDates(month, db);
  }

  // Auto-shift items off Sundays and skipped dates
  async shiftItemsOffHolidaysAndSkipDates(month, conn = null) {
    const db = conn || pool;
    const offDaysSet = await this.getOffDaysSet(month, db);

    const [items] = await db.query(
      'SELECT id, DATE_FORMAT(date, "%Y-%m-%d") AS date_str FROM content_calendar WHERE month = ?',
      [month]
    );

    for (const item of items) {
      if (offDaysSet.has(item.date_str)) {
        const nextValid = this.getNextValidWorkDay(item.date_str, month, offDaysSet);
        if (nextValid !== item.date_str) {
          await db.query('UPDATE content_calendar SET date = ? WHERE id = ?', [nextValid, item.id]);
        }
      }
    }
  }

  // Helper to get next valid work day (non-Sunday, non-skipped) starting from targetDateStr
  getNextValidWorkDay(targetDateStr, month, offDaysSet) {
    const cleanStr = targetDateStr.includes('T') ? targetDateStr.split('T')[0] : targetDateStr;
    const parts = cleanStr.split('-');
    if (parts.length !== 3) return targetDateStr;

    const year = parseInt(parts[0], 10);
    const monthInt = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    const totalDays = new Date(Date.UTC(year, monthInt, 0)).getUTCDate();

    let currentDay = day;
    while (currentDay <= totalDays) {
      const dStr = `${month}-${String(currentDay).padStart(2, '0')}`;
      if (!offDaysSet.has(dStr)) {
        return dStr;
      }
      currentDay++;
    }
    // Search backward if no day forward
    currentDay = day - 1;
    while (currentDay >= 1) {
      const dStr = `${month}-${String(currentDay).padStart(2, '0')}`;
      if (!offDaysSet.has(dStr)) {
        return dStr;
      }
      currentDay--;
    }
    return targetDateStr;
  }

  // Get saved calendar items for a month
  async getCalendarByMonth(month) {
    // Fail-safe: Auto-shift any items off off-days before fetching
    await this.shiftItemsOffHolidaysAndSkipDates(month);

    const [rows] = await pool.query(
      `SELECT cc.*, c.company_name AS client_name, c.client_id_code, at.activity_name,
              (SELECT md.status 
               FROM monthly_deliverables md 
               WHERE cc.client_id = md.client_id 
                 AND cc.activity_type_code = md.activity_type_code 
                 AND cc.date = md.due_date 
                 AND md.deleted_at IS NULL 
               LIMIT 1) AS deliverable_status
       FROM content_calendar cc
       LEFT JOIN clients c ON cc.client_id = c.id
       LEFT JOIN activity_types at ON cc.activity_type_code = at.activity_type_code
       WHERE cc.month = ?
       ORDER BY cc.date ASC, cc.id ASC`,
      [month]
    );
    return rows;
  }

  // Create a single calendar item
  async createCalendarItem(itemData) {
    let { client_id, date, month, activity_type_code, title, description } = itemData;
    await this.assertCalendarNotApproved(month);
    const cleanDate = typeof date === 'string' ? date.split('T')[0] : date;
    const offDaysSet = await this.getOffDaysSet(month);
    if (offDaysSet.has(cleanDate)) {
      date = this.getNextValidWorkDay(cleanDate, month, offDaysSet);
    }

    const activityCode = await generateNextActivityCode(pool, client_id, month, activity_type_code);
    const [result] = await pool.query(
      `INSERT INTO content_calendar (client_id, activity_type_code, activity_code, date, month, title, description, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'draft')`,
      [client_id, activity_type_code, activityCode, date, month, title, description]
    );
    return result.insertId;
  }

  // Update a calendar item
  async updateCalendarItem(id, itemData) {
    let { date, activity_type_code, title, description } = itemData;
    const [existing] = await pool.query('SELECT month, assigned_employee_id FROM content_calendar WHERE id = ?', [id]);
    if (existing.length === 0) {
      const error = new Error('Calendar item not found.');
      error.statusCode = 404;
      throw error;
    }
    await this.assertCalendarNotApproved(existing[0].month);
    if (existing[0].assigned_employee_id !== null) {
      const error = new Error('Work is assigned to the content writer');
      error.statusCode = 400;
      throw error;
    }

    const month = existing[0].month;
    const cleanDate = typeof date === 'string' ? date.split('T')[0] : date;
    const offDaysSet = await this.getOffDaysSet(month);
    if (offDaysSet.has(cleanDate)) {
      date = this.getNextValidWorkDay(cleanDate, month, offDaysSet);
    }

    const [result] = await pool.query(
      `UPDATE content_calendar 
       SET date = ?, activity_type_code = ?, title = ?, description = ?, status = 'draft' 
       WHERE id = ?`,
      [date, activity_type_code, title, description, id]
    );
  }

  // Delete a single calendar item
  async deleteCalendarItem(id) {
    const [existing] = await pool.query('SELECT month, assigned_employee_id FROM content_calendar WHERE id = ?', [id]);
    if (existing.length > 0) {
      await this.assertCalendarNotApproved(existing[0].month);
    }
    if (existing.length > 0 && existing[0].assigned_employee_id !== null) {
      const error = new Error('Work is assigned to the content writer');
      error.statusCode = 400;
      throw error;
    }
    const [result] = await pool.query('DELETE FROM content_calendar WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      const error = new Error('Calendar item not found.');
      error.statusCode = 404;
      throw error;
    }
  }

  // Delete an entire month's calendar
  async deleteCalendarMonth(month, adminUserId) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try {
      await this.assertCalendarNotApproved(month, connection);
      // Check if calendar items exist for this month
      const [existing] = await connection.query('SELECT id FROM content_calendar WHERE month = ?', [month]);
      if (existing.length === 0) {
        const error = new Error(`No calendar found for the month ${month}.`);
        error.statusCode = 404;
        throw error;
      }

      await connection.query('DELETE FROM content_calendar WHERE month = ?', [month]);
      await connection.query('DELETE FROM calendar_skip_dates WHERE month = ?', [month]);
      await dashboardRepository.createActivityLog(adminUserId, 'Delete Calendar', `Content calendar for "${month}" deleted.`, connection);
      await connection.commit();
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  // Auto-generate draft calendar from sheet rows
  async generateCalendar(month, rows, adminUserId, inputSkipDates = []) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      await this.assertCalendarNotApproved(month, connection);
      // 0. Save any input skip dates provided by Admin
      if (Array.isArray(inputSkipDates)) {
        await this.saveSkipDates(month, inputSkipDates, connection);
      }

      // Fetch unified offDaysSet (Sundays + Custom Skipped Dates) for this month
      const offDaysSet = await this.getOffDaysSet(month, connection);

      // 1. Delete all existing calendar items for this month before generating new schedule
      await connection.query('DELETE FROM content_calendar WHERE month = ?', [month]);

      // 2. Fetch active activity types
      const [activityTypes] = await connection.query('SELECT * FROM activity_types');

      // 3. Detect spreadsheet format
      const totalRowsCount = rows.length;
      
      const hasClientIdKey = totalRowsCount > 0 && Object.keys(rows[0]).some(k => /client\s*id|client\s*code/i.test(k));
      const hasActivityTypeKey = totalRowsCount > 0 && Object.keys(rows[0]).some(k => /activity\s*type/i.test(k));
      const isFormatC = hasClientIdKey && hasActivityTypeKey;
      
      const isFormatB = !isFormatC && totalRowsCount > 0 && isDateString(rows[0].clientName, totalRowsCount);

      if (isFormatC) {
        // --- FORMAT C: List of scheduled items (one item per row) ---
        for (const row of rows) {
          try {
            // Resolve Date
            const dateRaw = row.clientName || row.Date || row.date;
            if (!dateRaw) continue;
            let dateStr;
            const strTrimC = dateRaw.toString().trim();
            if (/^\d{1,2}$/.test(strTrimC)) {
              const day = parseInt(strTrimC, 10);
              dateStr = `${month}-${String(day).padStart(2, '0')}`;
            } else if (/^\d{4}-\d{2}-\d{2}$/.test(strTrimC)) {
              dateStr = strTrimC;
            } else {
              let parsedDate = new Date(strTrimC);
              if (isNaN(parsedDate.getTime())) {
                continue;
              }
              const y = parsedDate.getUTCFullYear();
              const m = String(parsedDate.getUTCMonth() + 1).padStart(2, '0');
              const d = String(parsedDate.getUTCDate()).padStart(2, '0');
              dateStr = `${y}-${m}-${d}`;
            }

            if (!dateStr.startsWith(month)) {
              continue; // Skip if date falls outside the selected month
            }

            // Shift if date is an off-day (Sunday or custom skipped date)
            if (offDaysSet.has(dateStr)) {
              dateStr = this.getNextValidWorkDay(dateStr, month, offDaysSet);
            }

            // Resolve Client ID Code / Company Name
            const clientIdKey = Object.keys(row).find(k => /client\s*id|client\s*code/i.test(k));
            const clientVal = row[clientIdKey] ? row[clientIdKey].toString().trim() : '';
            if (!clientVal) continue;

            // Normalize C005 to C0005
            let clientCode = clientVal;
            const codeMatch = clientVal.match(/^C(\d+)$/i);
            if (codeMatch) {
              const num = parseInt(codeMatch[1], 10);
              clientCode = `C${String(num).padStart(4, '0')}`;
            }

            // Find client in database
            const [existingClients] = await connection.query(
              'SELECT id, company_name FROM clients WHERE (client_id_code = ? OR company_name = ?) AND deleted_at IS NULL',
              [clientCode, clientVal]
            );

            let clientId;
            let clientCompanyName = clientVal;

            if (existingClients.length > 0) {
              clientId = existingClients[0].id;
              clientCompanyName = existingClients[0].company_name;
            } else {
              // Auto-create client
              const slug = slugify(clientVal);
              const tempEmail = `${slug}-${Date.now()}@reachskyline-temp.com`;
              
              const [lastCodeRows] = await connection.query('SELECT client_id_code FROM clients WHERE deleted_at IS NULL ORDER BY id DESC LIMIT 1');
              let nextCode = 'C0001';
              if (lastCodeRows.length > 0) {
                const lastCode = lastCodeRows[0].client_id_code;
                const match = lastCode.match(/^C(\d+)$/);
                if (match) {
                  nextCode = `C${String(parseInt(match[1], 10) + 1).padStart(4, '0')}`;
                }
              }

              const clientData = {
                client_id_code: nextCode,
                company_name: clientCompanyName,
                client_name: clientCompanyName,
                phone: '',
                email: tempEmail,
                address: '',
                website: '',
                gst_number: '',
                industry: 'Imported Client',
                start_date: new Date().toISOString().split('T')[0],
                status: 'active',
                notes: 'Automatically generated during content calendar spreadsheet upload.',
                created_by: adminUserId
              };

              const [clientResult] = await connection.query(
                `INSERT INTO clients (client_id_code, company_name, client_name, phone, email, address, website, gst_number, industry, start_date, status, notes, created_by)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                  clientData.client_id_code, clientData.company_name, clientData.client_name,
                  clientData.phone, clientData.email, clientData.address, clientData.website,
                  clientData.gst_number, clientData.industry, clientData.start_date,
                  clientData.status, clientData.notes, clientData.created_by
                ]
              );
              clientId = clientResult.insertId;
              
              await dashboardRepository.createActivityLog(adminUserId, 'Create Client', `Client company "${clientCompanyName}" (${nextCode}) created via Import.`, connection);
            }

            // Resolve Activity Type
            const activityTypeKey = Object.keys(row).find(k => /activity\s*type/i.test(k));
            const activityVal = row[activityTypeKey] ? row[activityTypeKey].toString().trim() : '';
            if (!activityVal) continue;

            const normalizedActivity = activityVal.toLowerCase().replace(/[^a-z0-9]/g, '');
            let matchedType = activityTypes.find(at => 
              normalizedActivity === at.activity_type_code.toLowerCase() ||
              normalizedActivity.includes(at.activity_name.toLowerCase().replace(/[^a-z0-9]/g, '')) ||
              normalizedActivity.includes(at.activity_type_code.toLowerCase())
            );

            let activityTypeCode = null;
            let activityTypeName = null;

            if (matchedType) {
              activityTypeCode = matchedType.activity_type_code;
              activityTypeName = matchedType.activity_name;
            } else {
              // Try fallback aliases
              if (['post', 'posts', 'p', 'pposts', 'poster', 'posters'].some(alias => normalizedActivity.includes(alias))) {
                activityTypeCode = 'AT001';
                activityTypeName = 'Poster';
              } else if (['reel', 'reels', 'r', 'rreels'].some(alias => normalizedActivity.includes(alias))) {
                activityTypeCode = 'AT002';
                activityTypeName = 'Reel';
              } else if (['carousel', 'carosel', 'c', 'carousels', 'carosels'].some(alias => normalizedActivity.includes(alias))) {
                activityTypeCode = 'AT003';
                activityTypeName = 'Carosel';
              } else if (['yts', 'shorts', 'youtubeshorts', 'ytsshorts', 'shortsandblogs', 'blog', 'blogs', 'b', 'article', 'articles'].some(alias => normalizedActivity.includes(alias))) {
                activityTypeCode = 'AT004';
                activityTypeName = 'Shorts and Blogs';
              } else if (['yt', 'longform', 'youtubelong', 'long', 'ytlong', 'youtube'].some(alias => normalizedActivity.includes(alias))) {
                activityTypeCode = 'AT005';
                activityTypeName = 'Longform';
              } else if (['event', 'events', 'eventday', 'eventdays', 'e'].some(alias => normalizedActivity.includes(alias))) {
                activityTypeCode = 'AT006';
                activityTypeName = 'Event Day';
              } else if (['adshort', 'adshorts', 'ads', 'ad'].some(alias => normalizedActivity.includes(alias))) {
                activityTypeCode = 'AT008';
                activityTypeName = 'Ad Shorts';
              }
            }

            if (!activityTypeCode) continue;

            // Resolve Title & Description
            const titleKey = Object.keys(row).find(k => k.toLowerCase() === 'title');
            const descKey = Object.keys(row).find(k => k.toLowerCase() === 'description');
            
            const rowTitle = row[titleKey] ? row[titleKey].toString().trim() : '';
            const rowDesc = row[descKey] ? row[descKey].toString().trim() : '';

            const title = rowTitle || `${clientCompanyName} - ${activityTypeName}`;
            const description = rowDesc || `Scheduled ${activityTypeName} deliverable for ${clientCompanyName}.`;

            // Generate activity code!
            const activityCode = await generateNextActivityCode(connection, clientId, month, activityTypeCode);

            // Insert Item
            await connection.query(
              `INSERT INTO content_calendar (client_id, activity_type_code, activity_code, date, month, title, description, status)
               VALUES (?, ?, ?, ?, ?, ?, ?, 'draft')`,
              [clientId, activityTypeCode, activityCode, dateStr, month, title, description]
            );

          } catch (itemErr) {
            console.error('Skipping row import error for Format C:', itemErr.message);
          }
        }
      } else if (isFormatB) {
        // --- FORMAT B: Dates in first column, Clients as column headers ---
        for (const row of rows) {
          try {
            const dateRaw = row.clientName;
            if (!dateRaw) continue;
            let dateStr;
            const strTrimB = dateRaw.toString().trim();
            if (/^\d{1,2}$/.test(strTrimB)) {
              const day = parseInt(strTrimB, 10);
              dateStr = `${month}-${String(day).padStart(2, '0')}`;
            } else if (/^\d{4}-\d{2}-\d{2}$/.test(strTrimB)) {
              dateStr = strTrimB;
            } else {
              let parsedDate = new Date(strTrimB);
              if (isNaN(parsedDate.getTime())) {
                continue; // Skip if invalid date
              }
              const y = parsedDate.getUTCFullYear();
              const m = String(parsedDate.getUTCMonth() + 1).padStart(2, '0');
              const d = String(parsedDate.getUTCDate()).padStart(2, '0');
              dateStr = `${y}-${m}-${d}`;
            }

            if (!dateStr.startsWith(month)) {
              continue; // Skip if date falls outside the selected month
            }

            // Shift if date is an off-day (Sunday or custom skipped date)
            if (offDaysSet.has(dateStr)) {
              dateStr = this.getNextValidWorkDay(dateStr, month, offDaysSet);
            }

            // Loop over headers representing Client Names
            for (const [key, value] of Object.entries(row)) {
              try {
                if (key === 'clientName' || key.toLowerCase() === 'date' || key.toLowerCase() === 'day') continue;
                if (!value || value.toString().trim() === '' || value.toString().toLowerCase() === '0') continue;

                const clientCompanyName = key.trim();
                const activityValue = value.toString().trim();

                // Resolve or Create Client
                const [existingClients] = await connection.query(
                  'SELECT id, company_name FROM clients WHERE company_name = ? AND deleted_at IS NULL',
                  [clientCompanyName]
                );

                let clientId;
                if (existingClients.length > 0) {
                  clientId = existingClients[0].id;
                } else {
                  // Auto-create client
                  const slug = slugify(clientCompanyName);
                  const tempEmail = `${slug}-${Date.now()}@reachskyline-temp.com`;
                  
                  const [lastCodeRows] = await connection.query('SELECT client_id_code FROM clients WHERE deleted_at IS NULL ORDER BY id DESC LIMIT 1');
                  let nextCode = 'C0001';
                  if (lastCodeRows.length > 0) {
                    const lastCode = lastCodeRows[0].client_id_code;
                    const match = lastCode.match(/^C(\d+)$/);
                    if (match) {
                      nextCode = `C${String(parseInt(match[1], 10) + 1).padStart(4, '0')}`;
                    }
                  }

                  const clientData = {
                    client_id_code: nextCode,
                    company_name: clientCompanyName,
                    client_name: clientCompanyName,
                    phone: '',
                    email: tempEmail,
                    address: '',
                    website: '',
                    gst_number: '',
                    industry: 'Imported Client',
                    start_date: new Date().toISOString().split('T')[0],
                    status: 'active',
                    notes: 'Automatically generated during content calendar spreadsheet upload.',
                    created_by: adminUserId
                  };

                  const [clientResult] = await connection.query(
                    `INSERT INTO clients (client_id_code, company_name, client_name, phone, email, address, website, gst_number, industry, start_date, status, notes, created_by)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                      clientData.client_id_code, clientData.company_name, clientData.client_name,
                      clientData.phone, clientData.email, clientData.address, clientData.website,
                      clientData.gst_number, clientData.industry, clientData.start_date,
                      clientData.status, clientData.notes, clientData.created_by
                    ]
                  );
                  clientId = clientResult.insertId;
                  
                  await dashboardRepository.createActivityLog(adminUserId, 'Create Client', `Client company "${clientCompanyName}" (${nextCode}) created via Import.`, connection);
                }

                // Resolve Activity Type Code
                const normalizedActivity = activityValue.toLowerCase().replace(/[^a-z0-9]/g, '');
                let matchedType = activityTypes.find(at => 
                  normalizedActivity.includes(at.activity_name.toLowerCase().replace(/[^a-z0-9]/g, '')) ||
                  normalizedActivity.includes(at.activity_type_code.toLowerCase())
                );

                let activityTypeCode = null;
                let activityTypeName = null;

                if (matchedType) {
                  activityTypeCode = matchedType.activity_type_code;
                  activityTypeName = matchedType.activity_name;
                } else {
                  // Try fallback aliases
                  if (['post', 'posts', 'p', 'pposts', 'poster', 'posters'].some(alias => normalizedActivity.includes(alias))) {
                    activityTypeCode = 'AT001';
                    activityTypeName = 'Poster';
                  } else if (['reel', 'reels', 'r', 'rreels'].some(alias => normalizedActivity.some(aliasItem => normalizedActivity.includes(aliasItem)))) {
                    activityTypeCode = 'AT002';
                    activityTypeName = 'Reel';
                  } else if (['carousel', 'carosel', 'c', 'carousels', 'carosels'].some(alias => normalizedActivity.includes(alias))) {
                    activityTypeCode = 'AT003';
                    activityTypeName = 'Carosel';
                  } else if (['yts', 'shorts', 'youtubeshorts', 'ytsshorts', 'shortsandblogs', 'blog', 'blogs', 'b', 'article', 'articles'].some(alias => normalizedActivity.includes(alias))) {
                    activityTypeCode = 'AT004';
                    activityTypeName = 'Shorts and Blogs';
                  } else if (['yt', 'longform', 'youtubelong', 'long', 'ytlong', 'youtube'].some(alias => normalizedActivity.includes(alias))) {
                    activityTypeCode = 'AT005';
                    activityTypeName = 'Longform';
                  } else if (['event', 'events', 'eventday', 'eventdays', 'e'].some(alias => normalizedActivity.includes(alias))) {
                    activityTypeCode = 'AT006';
                    activityTypeName = 'Event Day';
                  } else if (['adshort', 'adshorts', 'ads', 'ad'].some(alias => normalizedActivity.includes(alias))) {
                    activityTypeCode = 'AT008';
                    activityTypeName = 'Ad Shorts';
                  }
                }

                if (activityTypeCode) {
                  const title = `${clientCompanyName} - ${activityTypeName}`;
                  const description = `Imported scheduled ${activityTypeName} deliverable for ${clientCompanyName}.`;

                  // Generate activity code!
                  const activityCode = await generateNextActivityCode(connection, clientId, month, activityTypeCode);

                  await connection.query(
                    `INSERT INTO content_calendar (client_id, activity_type_code, activity_code, date, month, title, description, status)
                     VALUES (?, ?, ?, ?, ?, ?, ?, 'draft')`,
                    [clientId, activityTypeCode, activityCode, dateStr, month, title, description]
                  );
                }
              } catch (innerErr) {
                console.error(`Skipping item import error for key ${key} in row:`, innerErr.message);
              }
            }
          } catch (rowErr) {
            console.error('Skipping row import error:', rowErr.message);
          }
        }
      } else {
        // --- FORMAT A: Clients in first column, Activity Types as column headers ---
        const [yearStr, monthStr] = month.split('-');
        const year = parseInt(yearStr, 10);
        const monthInt = parseInt(monthStr, 10);
        const totalDays = new Date(year, monthInt, 0).getDate(); // Get last day of month

        // Calculate valid work days (excluding Sundays & custom skipped dates)
        const validWorkDays = [];
        for (let d = 1; d <= totalDays; d++) {
          const dStr = `${month}-${String(d).padStart(2, '0')}`;
          if (!offDaysSet.has(dStr)) {
            validWorkDays.push(d);
          }
        }
        const totalValid = validWorkDays.length > 0 ? validWorkDays.length : totalDays;

        for (const row of rows) {
          try {
            const clientName = row.clientName;
            if (!clientName || clientName.trim() === '') continue;

            // Resolve or Create Client
            const [existingClients] = await connection.query(
              'SELECT id, company_name FROM clients WHERE company_name = ? AND deleted_at IS NULL',
              [clientName.trim()]
            );

            let clientId;
            let companyName = clientName.trim();
            
            if (existingClients.length > 0) {
              clientId = existingClients[0].id;
              companyName = existingClients[0].company_name;
            } else {
              // Auto-create client
              const slug = slugify(companyName);
              const tempEmail = `${slug}-${Date.now()}@reachskyline-temp.com`;
              
              const [lastCodeRows] = await connection.query('SELECT client_id_code FROM clients WHERE deleted_at IS NULL ORDER BY id DESC LIMIT 1');
              let nextCode = 'C0001';
              if (lastCodeRows.length > 0) {
                const lastCode = lastCodeRows[0].client_id_code;
                const match = lastCode.match(/^C(\d+)$/);
                if (match) {
                  nextCode = `C${String(parseInt(match[1], 10) + 1).padStart(4, '0')}`;
                }
              }

              const clientData = {
                client_id_code: nextCode,
                company_name: companyName,
                client_name: companyName,
                phone: '',
                email: tempEmail,
                address: '',
                website: '',
                gst_number: '',
                industry: 'Imported Client',
                start_date: new Date().toISOString().split('T')[0],
                status: 'active',
                notes: 'Automatically generated during content calendar spreadsheet upload.',
                created_by: adminUserId
              };

              const [clientResult] = await connection.query(
                `INSERT INTO clients (client_id_code, company_name, client_name, phone, email, address, website, gst_number, industry, start_date, status, notes, created_by)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                  clientData.client_id_code, clientData.company_name, clientData.client_name,
                  clientData.phone, clientData.email, clientData.address, clientData.website,
                  clientData.gst_number, clientData.industry, clientData.start_date,
                  clientData.status, clientData.notes, clientData.created_by
                ]
              );
              clientId = clientResult.insertId;
              
              await dashboardRepository.createActivityLog(adminUserId, 'Create Client', `Client company "${companyName}" (${nextCode}) created via Import.`, connection);
            }

            // Compile Deliverables for this client dynamically using headers
            const quantities = mapRowToActivityQuantities(row, activityTypes);
            const itemsToSchedule = [];
            let offsetIndex = 0;

            for (const [code, qty] of Object.entries(quantities)) {
              if (qty <= 0) continue;
              
              const staggerOffset = (offsetIndex * 0.25) % 1; // Stagger different categories
              const activityType = activityTypes.find(at => at.activity_type_code === code);
              const typeName = activityType ? activityType.activity_name : code;

              for (let i = 0; i < qty; i++) {
                itemsToSchedule.push({
                  activity_type_code: code,
                  typeName,
                  index: i + 1,
                  score: (i + staggerOffset) / qty
                });
              }
              offsetIndex++;
            }

            // Interleave categories by score
            itemsToSchedule.sort((a, b) => a.score - b.score);

            const totalItems = itemsToSchedule.length;
            if (totalItems === 0) continue;

            // Map to valid work days (excluding Sundays & skipped dates)
            for (let m = 0; m < totalItems; m++) {
              try {
                const item = itemsToSchedule[m];
                let day;
                
                if (totalValid > 0) {
                  if (totalItems <= totalValid) {
                    const idx = Math.floor(m * (totalValid / totalItems));
                    day = validWorkDays[idx];
                  } else {
                    day = validWorkDays[m % totalValid];
                  }
                } else {
                  if (totalItems <= totalDays) {
                    day = Math.floor(m * (totalDays / totalItems)) + 1;
                  } else {
                    day = (m % totalDays) + 1;
                  }
                }

                let dateStr = `${month}-${String(day).padStart(2, '0')}`;
                if (offDaysSet.has(dateStr)) {
                  dateStr = this.getNextValidWorkDay(dateStr, month, offDaysSet);
                }
                const title = `${companyName} - ${item.typeName} #${item.index}`;
                const description = `Scheduled ${item.typeName} deliverables for ${companyName} (${month}).`;

                // Generate activity code!
                const activityCode = await generateNextActivityCode(connection, clientId, month, item.activity_type_code);

                await connection.query(
                  `INSERT INTO content_calendar (client_id, activity_type_code, activity_code, date, month, title, description, status)
                   VALUES (?, ?, ?, ?, ?, ?, ?, 'draft')`,
                  [clientId, item.activity_type_code, activityCode, dateStr, month, title, description]
                );
              } catch (itemErr) {
                console.error(`Skipping item scheduling error for Format A:`, itemErr.message);
              }
            }
          } catch (rowErr) {
            console.error('Skipping row import error for Format A:', rowErr.message);
          }
        }
      }

      await dashboardRepository.createActivityLog(adminUserId, 'Generate Calendar', `Content calendar generated for month "${month}".`, connection);
      await connection.commit();
      
      return await this.getCalendarByMonth(month);
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  // Approve content calendar and convert to monthly deliverables
  // Helper to format date as YYYY-MM-DD
  formatLocalDate(date) {
    if (!date) return '';
    if (typeof date === 'string') {
      return date.split('T')[0];
    }
    const dObj = new Date(date);
    if (isNaN(dObj.getTime())) return '';
    const yyyy = dObj.getUTCFullYear();
    const mm = String(dObj.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(dObj.getUTCDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  // Approve content calendar and convert to monthly deliverables
  async approveCalendar(month, adminUserId) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // 1. Fetch all items in content_calendar for this month
      const [allCcItems] = await connection.query(
        'SELECT cc.*, at.activity_name FROM content_calendar cc LEFT JOIN activity_types at ON cc.activity_type_code = at.activity_type_code WHERE cc.month = ?',
        [month]
      );

      // 2. Fetch all active deliverables for this month in monthly_deliverables
      const [allDelivs] = await connection.query(
        'SELECT * FROM monthly_deliverables WHERE month = ? AND deleted_at IS NULL AND activity_code IS NOT NULL',
        [month]
      );

      // 3. Compute differences
      const delivMap = new Map();
      allDelivs.forEach(d => delivMap.set(d.activity_code, d));

      const additions = [];
      const updates = [];
      const matchedCcCodes = new Set();

      allCcItems.forEach(item => {
        if (!item.activity_code) return; // defensive
        matchedCcCodes.add(item.activity_code);
        const deliv = delivMap.get(item.activity_code);

        if (!deliv) {
          additions.push(item);
        } else {
          // Compare details
          const ccDateStr = this.formatLocalDate(item.date);
          const delivDateStr = this.formatLocalDate(deliv.due_date);
          const ccDeliverable = `${item.activity_type_code.toUpperCase()}: ${item.title}`;
          
          if (
            ccDateStr !== delivDateStr ||
            ccDeliverable !== deliv.deliverable ||
            (item.description || '') !== (deliv.description || '') ||
            (item.work_link || '') !== (deliv.content_link || '')
          ) {
            updates.push(item);
          }
        }
      });

      const deletions = allDelivs.filter(d => !matchedCcCodes.has(d.activity_code));

      // 4. Check if there are any changes, draft, or sent_to_manager items. If not, throw "Already sent"
      const hasPendingApprovalItems = allCcItems.some(item => ['draft', 'sent_to_manager'].includes(item.status));
      if (additions.length === 0 && deletions.length === 0 && updates.length === 0 && !hasPendingApprovalItems) {
        const error = new Error('Already sent');
        error.statusCode = 400;
        throw error;
      }

      // 5. Resolve Creatives Department
      const [depts] = await connection.query('SELECT id FROM departments WHERE code = "CD-RS"');
      if (depts.length === 0) {
        const error = new Error('Creatives department (CD-RS) not found in ERP. Please create this department first.');
        error.statusCode = 400;
        throw error;
      }
      const gdDeptId = depts[0].id;

      // 6. Resolve Creatives Manager (Creatives Lead)
      const gdManagerId = await deliverableRepository.findDefaultManagerForDept(gdDeptId);
      if (!gdManagerId) {
        const error = new Error('Creatives department has no active managers. Please assign a Creatives manager first.');
        error.statusCode = 400;
        throw error;
      }

      // 7. Fetch all active employees in Creatives Department with sub-department name
      const [employees] = await connection.query(`
        SELECT e.id, e.full_name, e.sub_department_id, sd.name AS sub_dept_name
        FROM employees e
        LEFT JOIN sub_departments sd ON e.sub_department_id = sd.id
        WHERE e.department_id = ? AND e.status = 'active'
        ORDER BY e.id ASC
      `, [gdDeptId]);

      if (employees.length === 0) {
        const error = new Error('Creatives department has no active employees. Please create a Creatives employee first.');
        error.statusCode = 400;
        throw error;
      }

      const gdEmployeeId = employees[0].id; // Fallback default employee

      // 8. Fetch all activity types to map type code -> sub_department_id
      const [activityTypes] = await connection.query('SELECT activity_type_code, sub_department_id FROM activity_types');
      const activityTypeMap = {};
      activityTypes.forEach(at => {
        if (at.activity_type_code) {
          activityTypeMap[at.activity_type_code.toUpperCase()] = at.sub_department_id;
        }
      });

      // Helper to classify eligible employees for a sub_department_id
      const getEligibleEmployees = (subDeptId) => {
        if (!subDeptId) return employees;
        return employees.filter(emp => {
          if (Number(emp.sub_department_id) === Number(subDeptId)) return true;
          const nameLower = (emp.sub_dept_name || '').toLowerCase();
          if (nameLower.includes('creative') || Number(emp.sub_department_id) === 4) {
            if (Number(subDeptId) === 1 || Number(subDeptId) === 2) return true;
          }
          return false;
        });
      };

      // Keep round-robin pointers by sub_department_id
      const rrIndices = {};

      const isSentToEmployees = allCcItems.some(item => item.status === 'sent_to_employees');

      // ROUND ROBIN ASSIGNMENT TO CONTENT WRITERS (sub_department_id = 3) if already sent to employees
      const [writers] = await connection.query(
        "SELECT e.id FROM employees e JOIN sub_departments sd ON e.sub_department_id = sd.id WHERE sd.code = 'CW-RS' AND e.status = 'active' ORDER BY e.id"
      );

      // 9. Process additions
      for (let idx = 0; idx < additions.length; idx++) {
        const item = additions[idx];
        const formattedCode = item.activity_type_code.toUpperCase();
        const reqSubDeptId = activityTypeMap[formattedCode] || null;
        
        const eligible = getEligibleEmployees(reqSubDeptId);
        let chosenEmployeeId = gdEmployeeId;
        
        if (eligible.length > 0) {
          const key = formattedCode;
          const currentIndex = rrIndices[key] || 0;
          chosenEmployeeId = eligible[currentIndex % eligible.length].id;
          rrIndices[key] = currentIndex + 1;
        }

        let targetStatus = 'approved';
        let writerId = item.assigned_employee_id || null;

        if (isSentToEmployees && writers.length > 0) {
          targetStatus = 'sent_to_employees';
          writerId = writers[idx % writers.length].id;
        }

        // Insert deliverable
        await connection.query(
          `INSERT INTO monthly_deliverables (client_id, month, department_id, activity_type_code, activity_code, deliverable, quantity, assigned_manager_id, assigned_employee_id, priority, due_date, description, status, remarks, created_by, content_link, content_writer_id)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            item.client_id,
            item.month,
            gdDeptId,
            item.activity_type_code,
            item.activity_code,
            `${formattedCode}: ${item.title}`,
            1, // quantity
            gdManagerId,
            chosenEmployeeId,
            'medium', // priority
            item.date,
            item.description,
            'pending', // status
            '', // remarks
            adminUserId,
            item.work_link,
            writerId
          ]
        );

        // Update calendar item status
        await connection.query(
          'UPDATE content_calendar SET status = ?, assigned_employee_id = ?, submission_status = "pending" WHERE id = ?',
          [targetStatus, writerId, item.id]
        );
      }

      // 10. Process deletions
      for (const deliv of deletions) {
        await connection.query(
          "UPDATE monthly_deliverables SET deleted_at = CURRENT_TIMESTAMP WHERE activity_code = ?",
          [deliv.activity_code]
        );
      }

      // 11. Process updates
      for (const item of updates) {
        const targetStatus = isSentToEmployees ? 'sent_to_employees' : 'approved';
        const writerId = item.assigned_employee_id || null;
        await connection.query(
          `UPDATE monthly_deliverables 
           SET due_date = ?, deliverable = ?, description = ?, content_link = ?, content_writer_id = COALESCE(?, content_writer_id) 
           WHERE activity_code = ? AND deleted_at IS NULL`,
          [
            this.formatLocalDate(item.date),
            `${item.activity_type_code.toUpperCase()}: ${item.title}`,
            item.description,
            item.work_link,
            writerId,
            item.activity_code
          ]
        );

        await connection.query(
          'UPDATE content_calendar SET status = ? WHERE id = ?',
          [targetStatus, item.id]
        );
      }

      // 11b. Update any remaining draft or sent_to_manager items to approved/sent status (so they show up correctly)
      await connection.query(
        "UPDATE content_calendar SET status = ? WHERE month = ? AND status IN ('draft', 'sent_to_manager')",
        [isSentToEmployees ? 'sent_to_employees' : 'approved', month]
      );

      // 12. Create Activity Log
      await dashboardRepository.createActivityLog(
        adminUserId,
        'Approve Calendar',
        `Approved/Updated content calendar for month "${month}". Additions: ${additions.length}, Deletions: ${deletions.length}, Updates: ${updates.length}.`,
        connection
      );

      const [managerDetails] = await connection.query('SELECT full_name FROM managers WHERE id = ?', [gdManagerId]);
      const managerName = managerDetails[0] ? managerDetails[0].full_name : 'Graphic Design Manager';

      // 13. Create Notifications
      await notificationRepository.createNotification(
        `Calendar Approved: Content Calendar for ${month} has been updated. Additions: ${additions.length}, Deletions: ${deletions.length}, Updates: ${updates.length}. Assigned to creatives lead ${managerName}.`,
        'deliverables_assigned',
        connection
      );

      // Resolve SMM Department Manager to notify
      const [smmDepts] = await connection.query('SELECT id FROM departments WHERE code = "SMM-RS"');
      if (smmDepts.length > 0) {
        const smmManagerId = await deliverableRepository.findDefaultManagerForDept(smmDepts[0].id);
        if (smmManagerId) {
          const [smmManagerDetails] = await connection.query('SELECT full_name FROM managers WHERE id = ?', [smmManagerId]);
          const smmManagerName = smmManagerDetails[0] ? smmManagerDetails[0].full_name : 'SMM Lead';
          await notificationRepository.createNotification(
            `Calendar Approved: Content Calendar for ${month} has been updated. Additions: ${additions.length}, Deletions: ${deletions.length}, Updates: ${updates.length}. Assigned to SMM Lead ${smmManagerName}.`,
            'deliverables_assigned',
            connection
          );
        }
      }

      await connection.commit();

      // Trigger targeted Push & In-App notification to Admins
      try {
        await notificationService.notifyAdmins(
          'Content Calendar Approved',
          `The Content Calendar for ${month} has been approved by the Creative Manager. Deliverables have been generated and assigned.`,
          'calendar_approved',
          '/admin/deliverables',
          true
        );
      } catch (err) {
        console.error('[NotificationService] Error notifying admins on calendar approval:', err.message);
      }
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  async sendCalendarToEmployees(month, adminUserId) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try {
      // 1. Resolve Creatives Department
      const [depts] = await connection.query('SELECT id FROM departments WHERE code = "CD-RS"');
      if (depts.length === 0) {
        throw new Error('Creatives department (CD-RS) not found.');
      }
      const deptId = depts[0].id;

      // 2. Update status of calendar items for this month to 'sent_to_employees'
      const [updateResult] = await connection.query(
        "UPDATE content_calendar SET status = 'sent_to_employees' WHERE month = ? AND status = 'approved'",
        [month]
      );

      if (updateResult.affectedRows === 0) {
        const error = new Error('Already sent');
        error.statusCode = 400;
        throw error;
      }

      // 3. Fetch all employees in this department
      const [employees] = await connection.query(
        "SELECT user_id, full_name FROM employees WHERE department_id = ? AND status = 'active'",
        [deptId]
      );

      if (employees.length > 0) {
        // 4. Create targeted notifications for all employees of the department
        for (const emp of employees) {
          if (emp.user_id) {
            await notificationService.notifyUser(
              emp.user_id,
              'Content Calendar Task Released',
              `Hello ${emp.full_name}, the Content Calendar for ${month} has been released. Please check your assigned tasks and Today's To-Do.`,
              'calendar_task',
              '/employee/calendar',
              true
            );
          }
        }
      }

      await connection.commit();
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  async sendCalendarToManager(month, adminUserId) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try {
      const [draftItems] = await connection.query(
        "SELECT id FROM content_calendar WHERE month = ? AND status = 'draft' LIMIT 1",
        [month]
      );
      const [allCalendarItems] = await connection.query(
        "SELECT id, status FROM content_calendar WHERE month = ?",
        [month]
      );

      if (allCalendarItems.length === 0) {
        throw new Error('No calendar items exist for this month.');
      }

      const hasOnlySentOrApproved = allCalendarItems.every(item => 
        ['sent_to_manager', 'approved', 'sent_to_employees'].includes(item.status)
      );

      if (draftItems.length === 0 && hasOnlySentOrApproved) {
        const error = new Error('already send');
        error.statusCode = 400;
        throw error;
      }

      // 1. Resolve Creatives Department
      const [depts] = await connection.query('SELECT id FROM departments WHERE code = "CD-RS"');
      if (depts.length === 0) {
        throw new Error('Creatives department (CD-RS) not found.');
      }
      const deptId = depts[0].id;

      // 2. Resolve Creatives Manager (Creatives Lead)
      const gdManagerId = await deliverableRepository.findDefaultManagerForDept(deptId);
      if (!gdManagerId) {
        throw new Error('Creatives department has no active managers.');
      }

      // Fetch Manager details for notification
      const [mgrDetails] = await connection.query('SELECT user_id, full_name FROM managers WHERE id = ?', [gdManagerId]);

      // Update content_calendar items to 'sent_to_manager'
      await connection.query(
        "UPDATE content_calendar SET status = 'sent_to_manager' WHERE month = ? AND status = 'draft'",
        [month]
      );

      // 3. Create Activity Log
      await dashboardRepository.createActivityLog(
        adminUserId,
        'Submit Calendar',
        `Admin submitted content calendar for month "${month}" to the Creative Manager.`,
        connection
      );

      await connection.commit();

      // Trigger targeted Push & In-App notification to the Creatives Manager
      if (mgrDetails.length > 0) {
        const managerName = mgrDetails[0].full_name;
        await notificationService.notifyManager(
          gdManagerId,
          'Content Calendar Submitted',
          `Hello ${managerName}, the Admin has submitted the Content Calendar for ${month} for your review and approval.`,
          'deliverables_assigned',
          '/manager/calendar',
          true
        );
      }
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  async setCalendarToDraft(month) {
    await this.assertCalendarNotApproved(month);
    await pool.query(
      "UPDATE content_calendar SET status = 'draft' WHERE month = ? AND (assigned_employee_id IS NULL)",
      [month]
    );
  }
}

module.exports = new CalendarService();
