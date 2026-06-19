
const RE_DESC = /^\S(?:.*\S)?$/;

const RE_DATE = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

const RE_CAT = /^[A-Za-z]+(?:[ \-][A-Za-z]+)*$/;

const RE_DUP_WORD = /\b(\w+)\s+\1\b/i;

const RE_AMOUNT = /^\d+(\.\d{1,2})?$/;

export function validateDescription(val) {
  if (!val || val.trim() === '') return 'Description is required.';
  if (!RE_DESC.test(val))     return 'No leading/trailing spaces or double spaces allowed.';
  if (RE_DUP_WORD.test(val))       return 'Duplicate word detected (e.g. "the the").';
  if (val.length > 120)            return 'Keep it under 120 characters.';
  return '';
}

export function validateAmount(val) {
  if (!val || val.trim() === '') return 'Amount is required.';
  if (!RE_AMOUNT.test(val))      return 'Enter a valid amount (e.g. 12 or 12.50).';
  if (parseFloat(val) <= 0)      return 'Amount must be greater than 0.';
  return '';
}

export function validateDate(val) {
  if (!val)              return 'Date is required.';
  if (!RE_DATE.test(val)) return 'Use YYYY-MM-DD format.';
  return '';
}

export function validateCategory(val) {
  if (!val)               return 'Please select a category.';
  return '';
}

export function validateNewCategory(val) {
  if (!val || val.trim() === '')  return 'Category name is required.';
  if (!RE_CAT.test(val.trim()))   return 'Letters, spaces, and hyphens only.';
  return '';
}

export function validateImport(data) {
  if (!Array.isArray(data)) return 'File must contain a JSON array.';
  for (const rec of data) {
    if (typeof rec.id          !== 'string')  return `Record missing "id": ${JSON.stringify(rec)}`;
    if (typeof rec.description !== 'string')  return `Record missing "description": ${rec.id}`;
    if (typeof rec.amount      !== 'number')  return `Record "amount" must be a number: ${rec.id}`;
    if (typeof rec.category    !== 'string')  return `Record missing "category": ${rec.id}`;
    if (typeof rec.date        !== 'string')  return `Record missing "date": ${rec.id}`;
  }
  return '';
}
