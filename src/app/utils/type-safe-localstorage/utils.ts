import { CardExport } from './types';

export function isValidCards(items: unknown): items is CardExport[] {
  if (!items || !Array.isArray(items)) {
    return false;
  }

  for (const item of items) {
    if (!isValidCardFields(item)) {
      return false;
    }
  }

  return true;
}

export function isValidCardFields(item: unknown): item is CardExport {
  if (!item || typeof item !== 'object') {
    return false;
  }

  if (!('tcgPlayerId' in item) || !('qty' in item)) {
    return false;
  }

  return isNumber(item.tcgPlayerId) && isNumber(item.qty);
}

export function isNumber(num: unknown): num is number {
  return typeof num === 'number';
}
