

const RECORDS_KEY  = 'ft:records';
const SETTINGS_KEY = 'ft:settings';

export function loadRecords() {
  try {
    return JSON.parse(localStorage.getItem(RECORDS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveRecords(records) {
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
}

export function loadSettings() {
  try {
    return JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
  } catch {
    return {};
  }
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function clearAll() {
  localStorage.removeItem(RECORDS_KEY);
  localStorage.removeItem(SETTINGS_KEY);
}
