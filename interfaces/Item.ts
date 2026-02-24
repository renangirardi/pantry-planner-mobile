import { ItemLocation } from './ItemLocation';

export interface Item {
  id: string;
  name: string;
  brand?: string;
  locations?: ItemLocation[];
  categoryId: string;
}
