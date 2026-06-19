

import { loadRecords, saveRecords, clearAll } from './storage.js';
import {
  getRecords, addRecord, updateRecord, deleteRecord,
  setRecords, getSettings, updateSettings, makeId
}
from './state.js';
import {
  showSection, renderTable, renderStats, renderCategoryList,
  renderCategoryOptions, toast, setFieldError, clearForm, makeRowEditable
}
from './ui.js';

import { compileRegex, filterRecords } from './search.js';
import {
  validateDescription, validateAmount, validateDate,
  validateCategory, validateNewCategory, validateImport
}

from './validators.js';

let sortKey = 'date';
let sortAsc = false;
let currentRe = null;


function init() {
  showSection('about');
  refreshAll();

  
  document.querySelectorAll('.nav-link').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const id = a.dataset.section;
      showSection(id);
      if (id === 'dashboard') renderStats(getRecords());
      if (id === 'records')   refreshTable();
      if (id === 'add')       renderCategoryOptions(getSettings().categories);
      if (id === 'settings')  renderSettingsUI();
    });
  });

  
  document.getElementById('expense-form').addEventListener('submit', handleFormSubmit);
  document.getElementById('cancel-btn').addEventListener('click', () => {
    clearForm();
    showSection('records');
  });


  document.getElementById('f-description').addEventListener('input', () => {
    const v = document.getElementById('f-description').value;
    setFieldError('f-description', 'f-description-err', validateDescription(v));
  });
  document.getElementById('f-amount').addEventListener('input', () => {
    const v = document.getElementById('f-amount').value;
    setFieldError('f-amount', 'f-amount-err', validateAmount(v));
  });


  document.querySelectorAll('.sort-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.sort;
      if (sortKey === key) { sortAsc = !sortAsc; }
      else { sortKey = key; sortAsc = true; }
      document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      refreshTable();
    });
  });

  document.getElementById('search-input').addEventListener('input', handleSearch);
  document.getElementById('search-case').addEventListener('change', handleSearch);

  
  document.getElementById('records-body').addEventListener('click', handleTableClick);

  
  document.getElementById('export-btn').addEventListener('click', handleExport);

 
  document.getElementById('import-file').addEventListener('change', handleImport);

  document.getElementById('save-budget-btn').addEventListener('click', saveBudget);
  document.getElementById('save-rates-btn').addEventListener('click', saveRates);
  document.getElementById('add-cat-btn').addEventListener('click', addCategory);
  document.getElementById('clear-btn').addEventListener('click', handleClearAll);

  document.getElementById('s-budget').addEventListener('input', () => {
    updateConverter(parseFloat(document.getElementById('s-budget').value) || 0);
  });
}
function refreshAll() {
  refreshTable();
  renderStats(getRecords());
  renderCategoryOptions(getSettings().categories);
}
function refreshTable() {
  const sorted   = getSorted(getRecords());
  const filtered = filterRecords(sorted, currentRe);
  renderTable(filtered, currentRe);
}

 function getSorted(records) {
  return [...records].sort((a, b) => {
    let va = a[sortKey], vb = b[sortKey];
    if (sortKey === 'amount') { va = parseFloat(va); vb = parseFloat(vb); }
    else { va = va?.toLowerCase?.() ?? va; vb = vb?.toLowerCase?.() ?? vb; }
    if (va < vb) return sortAsc ? -1 : 1;
    if (va > vb) return sortAsc ?  1 : -1;
    return 0;
  });
}

function handleSearch() {
  const input = document.getElementById('search-input').value;
  const caseSensitive = document.getElementById('search-case').checked;
  const errEl = document.getElementById('search-error');

  if (!input) {
    currentRe = null;
    errEl.textContent = '';
    refreshTable();
    return;
  }
  const re = compileRegex(input, caseSensitive);
  if (re === null && input.trim() !== '') {
    errEl.textContent = 'Invalid regex pattern.';
    currentRe = null;
  } else {
    errEl.textContent = '';
    currentRe = re;
  }
  refreshTable();
}

// Table click (edit/delete/save/cancel)
function handleTableClick(e) {
  const target = e.target;

  // Delete
  if (target.classList.contains('btn-delete') && target.dataset.id) {
    const id = target.dataset.id;
    if (confirm('Delete this record?')) {
      deleteRecord(id);
      refreshAll();
      toast('Record deleted.');
    }
    return;
  }

  // Edit place
  if (target.classList.contains('btn-edit') && target.dataset.id) {
    const id  = target.dataset.id;
    const rec = getRecords().find(r => r.id === id);
    if (!rec) return;
    const tr  = target.closest('tr');
    makeRowEditable(tr, rec);
    return;
  }

  // Save inline edit
  if (target.dataset.save) {
    const id      = target.dataset.save;
    const desc    = document.getElementById('ei-desc')?.value   || '';
    const amount  = document.getElementById('ei-amount')?.value || '';
    const cat     = document.getElementById('ei-cat')?.value    || '';
    const date    = document.getElementById('ei-date')?.value   || '';

    const descErr = validateDescription(desc);
    const amtErr  = validateAmount(amount);
    if (descErr || amtErr) { toast(descErr || amtErr, true); return; }

    updateRecord(id, { description: desc.trim(), amount: parseFloat(amount), category: cat, date });
    refreshAll();
    toast('Record updated.');
    return;
  }

  // Cancel inline edit
  if (target.dataset.cancel) {
    refreshTable();
    return;
  }
}

// Form submit (add or update)
function handleFormSubmit(e) {
  e.preventDefault();

  const desc   = document.getElementById('f-description').value;
  const amount = document.getElementById('f-amount').value;
  const cat    = document.getElementById('f-category').value;
  const date   = document.getElementById('f-date').value;
  const editId = document.getElementById('edit-id').value;

  const descErr = validateDescription(desc);
  const amtErr  = validateAmount(amount);
  const catErr  = validateCategory(cat);
  const dateErr = validateDate(date);

  setFieldError('f-description', 'f-description-err', descErr);
  setFieldError('f-amount',      'f-amount-err',      amtErr);
  setFieldError('f-category',    'f-category-err',    catErr);
  setFieldError('f-date',        'f-date-err',        dateErr);

  if (descErr || amtErr || catErr || dateErr) return;

  const now = new Date().toISOString();

  if (editId) {
    updateRecord(editId, { description: desc.trim(), amount: parseFloat(amount), category: cat, date, updatedAt: now });
    toast('Record updated.');
  } else {
    addRecord({ id: makeId(), description: desc.trim(), amount: parseFloat(amount), category: cat, date, createdAt: now, updatedAt: now });
    toast('Record added!');
  }

  clearForm();
  refreshAll();
  showSection('records');
}

//  Export
function handleExport() {
  const data = JSON.stringify(getRecords(), null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'finance-tracker-export.json';
  a.click();
  URL.revokeObjectURL(url);
  toast('Exported successfully.');
}

//  Import
function handleImport(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const parsed = JSON.parse(ev.target.result);
      const err    = validateImport(parsed);
      if (err) { toast('Import failed: ' + err, true); return; }
      setRecords(parsed);
      refreshAll();
      toast(`Imported ${parsed.length} records.`);
    } catch {
      toast('Import failed: invalid JSON file.', true);
    }
    e.target.value = ''; // reset file input
  };
  reader.readAsText(file);
}

// Settings
function renderSettingsUI() {
  const s = getSettings();
  document.getElementById('s-budget').value = s.budget || '';
  document.getElementById('s-eur').value    = s.eurRate || '';
  document.getElementById('s-gbp').value    = s.gbpRate || '';
  renderCategoryList(s.categories, deleteCategory);
}

function saveBudget() {
  const val = parseFloat(document.getElementById('s-budget').value) || 0;
  updateSettings({ budget: val });
  renderStats(getRecords());
  toast('Budget saved.');
}

function saveRates() {
  const eur = parseFloat(document.getElementById('s-eur').value) || 0.92;
  const gbp = parseFloat(document.getElementById('s-gbp').value) || 0.79;
  updateSettings({ eurRate: eur, gbpRate: gbp });
  updateConverter(parseFloat(document.getElementById('s-budget').value) || 0);
  toast('Rates saved.');
}

function updateConverter(usd) {
  const s = getSettings();
  document.getElementById('conv-usd').textContent = usd.toFixed(2);
  document.getElementById('conv-eur').textContent = (usd * s.eurRate).toFixed(2);
  document.getElementById('conv-gbp').textContent = (usd * s.gbpRate).toFixed(2);
}

function addCategory() {
  const input = document.getElementById('s-new-cat');
  const errEl = document.getElementById('cat-err');
  const val   = input.value.trim();
  const err   = validateNewCategory(val);
  if (err) { errEl.textContent = err; return; }
  errEl.textContent = '';
  const s = getSettings();
  if (s.categories.includes(val)) { errEl.textContent = 'Category already exists.'; return; }
  updateSettings({ categories: [...s.categories, val] });
  renderCategoryList(getSettings().categories, deleteCategory);
  renderCategoryOptions(getSettings().categories);
  input.value = '';
  toast(`Category "${val}" added.`);
}

function deleteCategory(cat) {
  if (!confirm(`Remove category "${cat}"?`)) return;
  const s = getSettings();
  updateSettings({ categories: s.categories.filter(c => c !== cat) });
  renderCategoryList(getSettings().categories, deleteCategory);
  renderCategoryOptions(getSettings().categories);
  toast(`Category "${cat}" removed.`);
}

function handleClearAll() {
  if (!confirm('Delete ALL records and settings? This cannot be undone.')) return;
  clearAll();
  location.reload();
}

// Start
init();
