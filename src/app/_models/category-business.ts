import {Restaurant} from '@app/_models/restaurant';

export class CategoryBusiness {
  id: number = 0;
  name: string = '';
  isActive: boolean = true;
  businesses: Restaurant[] = [];
  url: string = '';
}
