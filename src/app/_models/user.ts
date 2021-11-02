import {Subscription} from "@app/_models/subscription";

export class User {
  id: number;
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  street: string;
  zipcode: string;
  city: string;
  email?: string;
  token?: string;
  notifications: any[];
  orders?: any[] = [];
  addresses: any[];
  phone: string = '';
  roles?: string[] = [];
  data?: {
    subscription?: Subscription;
    percent: number,
    isFreeShippingCost: boolean,
    title: string
  } = {
    percent: 0,
    isFreeShippingCost: false,
    title: ''
  };
}
