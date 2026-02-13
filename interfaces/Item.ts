import { ItemLocation } from './ItemLocation';

export interface Item {
  id: string;
  name: string;
  quantity?: number;
  weight?: string;
  volume?: string;
  locations: ItemLocation[];
}
