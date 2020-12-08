import {Supplement} from '@app/_models/supplement';
import {Restaurant} from "@app/_models/restaurant";

export class ListSupplements {
  id: number;
  title: string;
  multipleChoice: boolean;
  isAvailable: boolean;
  amount: number;
  maxChoice: number;
  isForMenu: boolean;
  isRequired: boolean;
  supplementProducts: Supplement[] = []; // items de cette liste
  restaurant: Restaurant;
  lists: ListSupplements[] = [];
  subList?: ListSupplements[] = [];
}
