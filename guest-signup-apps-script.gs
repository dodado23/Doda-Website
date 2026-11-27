const SPREADSHEET_ID = '1DCYakVtRNZqqYoQi-Uw2TmRlVwwaMbIdQWtjxPWwXRQ';
const SHEET_NAME = 'Signups';

function doPost(event) {
  const data = event && event.parameter ? event.parameter : {};
  if (data.website) return ContentService.createTextOutput('OK');

  const performer = String(data.performer || '').trim().slice(0, 80);
  const guestType = String(data.guestType || '').trim();
  const guestNames = String(data.guestNames || '').trim().slice(0, 2000);
  const allowedPerformers = [
    'djdancer', 'SYSTEM ghost', 'Calum X', 'purityleech', '44', 'SLEEPYHEVD',
    'Doda', 'IQYU', 'Echo', 'N33T', 'Steffen yoshiki', 'Levi',
  ];
  const nameList = guestNames.split(/\r?\n/).map(name => name.trim()).filter(Boolean);
  if (!allowedPerformers.includes(performer) ||
      !['Free Guest', 'Discount Guests'].includes(guestType) ||
      nameList.length < 1 || (guestType === 'Free Guest' && nameList.length !== 1)) {
    return ContentService.createTextOutput('Invalid signup');
  }

  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('Signups sheet not found');
  sheet.appendRow([new Date(), performer, guestType, nameList.join('\n')]);
  return ContentService.createTextOutput('OK');
}
