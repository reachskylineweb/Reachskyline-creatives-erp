const pool = require('../config/db');

function getTypeCode(activityTypeCode) {
  if (!activityTypeCode) return 'P';
  const code = activityTypeCode.toUpperCase();
  if (code === 'AT001' || code === 'P') return 'P';
  if (code === 'AT002' || code === 'R') return 'R';
  if (code === 'AT003' || code === 'C') return 'C';
  if (code === 'AT004' || code === 'S') return 'S';
  if (code === 'AT005' || code === 'L') return 'L';
  if (code === 'AT006' || code === 'E') return 'E';
  if (code === 'B') return 'B';
  if (code === 'AT008') return 'S'; // Ad Shorts -> S
  if (code === 'JD') return 'JD';
  if (code === 'CRM') return 'CRM';
  if (code === 'ST') return 'ST';
  if (code === 'W') return 'W';
  return code.slice(0, 2);
}

async function generateNextActivityCode(connectionOrPool, clientId, month, activityTypeCode) {
  const [clientRows] = await connectionOrPool.query("SELECT id, client_id_code FROM clients WHERE id = ?", [clientId]);
  const client = clientRows[0] || { id: clientId, client_id_code: '000' };
  const clientCodeNum = client.client_id_code ? client.client_id_code.replace(/\D/g, '').padStart(3, '0') : String(clientId).padStart(3, '0');

  const [year, monthNum] = month.split('-');
  const yearDigit = year.slice(-1);
  const monthDigit = monthNum;
  
  const typeCode = getTypeCode(activityTypeCode);
  const prefix = `${yearDigit}${monthDigit}${clientCodeNum}${typeCode}`;
  
  const [calRows] = await connectionOrPool.query(
    "SELECT COUNT(*) AS count FROM content_calendar WHERE client_id = ? AND month = ? AND activity_code LIKE ?",
    [clientId, month, `${prefix}%`]
  );
  
  const [delRows] = await connectionOrPool.query(
    "SELECT COUNT(*) AS count FROM monthly_deliverables WHERE client_id = ? AND month = ? AND activity_code LIKE ? AND deleted_at IS NULL",
    [clientId, month, `${prefix}%`]
  );

  const [jobRows] = await connectionOrPool.query(
    "SELECT COUNT(*) AS count FROM job_works WHERE client_id = ? AND DATE_FORMAT(deadline, '%Y-%m') = ? AND activity_code LIKE ?",
    [clientId, month, `${prefix}%`]
  );

  const count = (calRows[0].count || 0) + (delRows[0].count || 0) + (jobRows[0].count || 0) + 1;
  return `${prefix}${count}`;
}

module.exports = {
  getTypeCode,
  generateNextActivityCode
};
