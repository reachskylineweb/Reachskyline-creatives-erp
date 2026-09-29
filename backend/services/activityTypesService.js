const axios = require('axios');
const pool = require('../config/db');

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

class ActivityTypesService {
  // List all activity types
  async listActivityTypes() {
    const [rows] = await pool.query(`
      SELECT at.*, sd.name AS sub_department_name 
      FROM activity_types at
      LEFT JOIN sub_departments sd ON at.sub_department_id = sd.id
      ORDER BY at.activity_type_code ASC
    `);
    return rows;
  }

  // Create single activity type
  async createActivityType(data) {
    const { activity_type_code, activity_name, time_editor, time_content, editor_employees, content_employees, sub_department_id } = data;
    
    // Check if code exists
    const [existing] = await pool.query('SELECT id FROM activity_types WHERE activity_type_code = ?', [activity_type_code]);
    if (existing.length > 0) {
      const error = new Error(`Activity type code "${activity_type_code}" already exists.`);
      error.statusCode = 400;
      throw error;
    }

    const [result] = await pool.query(
      `INSERT INTO activity_types (activity_type_code, activity_name, time_editor, time_content, editor_employees, content_employees, sub_department_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [activity_type_code, activity_name, Number(time_editor) || 0, Number(time_content) || 0, editor_employees, content_employees, sub_department_id ? Number(sub_department_id) : null]
    );
    return result.insertId;
  }

  // Update single activity type
  async updateActivityType(id, data) {
    const { activity_type_code, activity_name, time_editor, time_content, editor_employees, content_employees, sub_department_id } = data;
    
    // Check unique code excluding current id
    const [existing] = await pool.query('SELECT id FROM activity_types WHERE activity_type_code = ? AND id != ?', [activity_type_code, id]);
    if (existing.length > 0) {
      const error = new Error(`Activity type code "${activity_type_code}" is already in use by another record.`);
      error.statusCode = 400;
      throw error;
    }

    const [result] = await pool.query(
      `UPDATE activity_types 
       SET activity_type_code = ?, activity_name = ?, time_editor = ?, time_content = ?, editor_employees = ?, content_employees = ?, sub_department_id = ? 
       WHERE id = ?`,
      [activity_type_code, activity_name, Number(time_editor) || 0, Number(time_content) || 0, editor_employees, content_employees, sub_department_id ? Number(sub_department_id) : null, id]
    );
    if (result.affectedRows === 0) {
      const error = new Error('Activity type not found.');
      error.statusCode = 404;
      throw error;
    }
  }

  // Delete activity type
  async deleteActivityType(id) {
    const [result] = await pool.query('DELETE FROM activity_types WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      const error = new Error('Activity type not found.');
      error.statusCode = 404;
      throw error;
    }
  }

  // Sync / Import activity types from Google Sheet (gid=1805900264)
  async syncActivityTypes(url) {
    const sheetIdMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (!sheetIdMatch) {
      const error = new Error('Invalid Google Sheets URL format. Make sure it contains "/d/SPREADSHEET_ID"');
      error.statusCode = 400;
      throw error;
    }
    const sheetId = sheetIdMatch[1];
    const gidMatch = url.match(/gid=(\d+)/);
    const gid = gidMatch ? gidMatch[1] : '1805900264'; // Default to your Activity types tab gid

    const exportUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
    
    try {
      const response = await axios.get(exportUrl);
      const parsedLines = parseCSV(response.data);
      
      const upsertedCodes = [];
      const connection = await pool.getConnection();
      await connection.beginTransaction();

      try {
        for (const line of parsedLines) {
          if (!line[0] || line[0].trim() === '' || line[0].toLowerCase().includes('activity type')) {
            continue; // Skip headers or empty rows
          }

          const activityTypeCode = line[0].trim();
          const activityName = line[1] ? line[1].trim() : '';
          const timeEditor = parseInt(line[2], 10) || 0;
          const timeContent = parseInt(line[3], 10) || 0;
          const editorEmployees = line[4] ? line[4].trim() : '';
          const contentEmployees = line[5] ? line[5].trim() : '';

          const sql = `
            INSERT INTO activity_types (activity_type_code, activity_name, time_editor, time_content, editor_employees, content_employees)
            VALUES (?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
              activity_name = VALUES(activity_name),
              time_editor = VALUES(time_editor),
              time_content = VALUES(time_content),
              editor_employees = VALUES(editor_employees),
              content_employees = VALUES(content_employees);
          `;
          
          await connection.query(sql, [activityTypeCode, activityName, timeEditor, timeContent, editorEmployees, contentEmployees]);
          upsertedCodes.push(activityTypeCode);
        }

        await connection.commit();
        return upsertedCodes;
      } catch (err) {
        await connection.rollback();
        throw err;
      } finally {
        connection.release();
      }
    } catch (err) {
      console.error('Google Sheets sync error:', err.message);
      const error = new Error('Failed to fetch or sync Activity Types. Please make sure the sheet is shared as "Anyone with the link can view".');
      error.statusCode = 400;
      throw error;
    }
  }
}

module.exports = new ActivityTypesService();
