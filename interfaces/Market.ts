import { Aisle } from './Aisle';

export interface Market {
  id: string;
  name: string;
  aisles: Aisle[];
}
