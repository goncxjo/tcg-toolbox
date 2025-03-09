import { CardExport } from './types';
import { CustomStorage } from './custom-storage';
import { isValidCardFields, isValidCards } from './utils';

const STORAGE_ITEMS_KEY = 'cards';

class CardsStorage {
  private static instance: CardsStorage;
  private storage: CustomStorage<CardExport>;

  private constructor() {
    this.storage = new CustomStorage<CardExport>(STORAGE_ITEMS_KEY);
  }

  public static getInstance(): CardsStorage {
    return this.instance ?? (this.instance = new CardsStorage());
  }

  public getItems(): CardExport[] {
    try {
      const items = this.storage.getItems() ?? [];
      if (!isValidCards(items)) {
        throw new Error('Invalid items');
      }

      return items;
    } catch (error: unknown) {
      this.logError(error);
      return [];
    }
  }

  public addItem(item: CardExport): void {
    try {
      if (!isValidCardFields(item)) {
        throw new Error('Invalid item fields');
      }

      const currentItems = this.storage.getItems() ?? [];
      if (!isValidCards(currentItems)) {
        throw new Error('Invalid items');
      }

      const items: CardExport[] = [...currentItems, item];
      this.storage.setItems(items);
    } catch (error: unknown) {
      this.logError(error);
    }
  }
  
  public setItems(items: CardExport[]): void {
    try {
      const currentItems = this.storage.getItems() ?? [];
      if (!isValidCards(currentItems)) {
        throw new Error('Invalid items');
      }

      items.forEach(item => {
        if (!isValidCardFields(item)) {
          throw new Error('Invalid item fields');
        }        
      });
      
      this.storage.setItems(items);
    } catch (error: unknown) {
      this.logError(error);
    }
  }
  
  public clearItems(): void {
    try {
      this.storage.clearItems();
    } catch (error: unknown) {
      this.logError(error);
    }
  }

  private logError(error: unknown): void {
    let errorMessage = 'An error occurred in CardsStorage';
    if (error instanceof Error) {
      errorMessage += `: ${error.message}`;
    }
    console.error(errorMessage);
  }
}

export const cardsStorage = CardsStorage.getInstance();