import {User} from '@app/_models/user';
import {Cart} from '@app/cart/model/cart';

export class Order {
  amount: number = 0;
  readonly id: number;
  customer: User;
  address: string = null;
  addressToDeliver: string = null;
  date: string = null;
  deliverCode: string = null;
  payedAt: string = null;
  orderAcceptedByMerchant?: boolean;
  idReference?: string = null;
  cartDetail: Cart;
  status: number;
  estimatedPreparationTime: string;
  preparationTime: string;
  // tslint:disable-next-line:variable-name
  delivery_cost: number;
  comment?: string;
}

