import {Restaurant} from '@app/_models/restaurant';
import {Deliverer} from '@app/_models/deliverer';

export class Sector {
  readonly id: number = 0;
  name: string = null;
  isActive: boolean = true;
  subSectors: Sector[] = [];
  businesses: Restaurant[] = [];
  deliverers: Deliverer[] = [];
}
