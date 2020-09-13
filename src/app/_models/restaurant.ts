import {Media} from "@app/_models/media";

export class Restaurant {
  id: number = 0;
  name: string = '';
  street: string = '';
  zipcode: string = '';
  city: string = '';
  description: string = '';
  emailContact: string = '';
  logo: Media = new Media();
  backgroundImg: Media = new Media();
  estimatedPreparationTime: string = '';
  tags: any[] = [];
}
