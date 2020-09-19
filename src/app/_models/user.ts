export class User {
  id: number;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  street: string;
  zipcode: string;
  city: string;
  token?: string;
  orders?: any[];
}
