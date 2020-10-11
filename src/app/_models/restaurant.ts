import {Media} from "@app/_models/media";

export class Restaurant {
  id: number = 0;
  name: string = '';
  street: string = '';
  zipcode: string = '';
  number: string = '';
  city: string = '';
  description: string = '';
  emailContact: string = '';
  opinions: any[] = [];
  medias: Media[] = [];
  logo: Media = new Media();
  backgroundImg: Media = new Media();
  estimatedPreparationTime: string = '';
  tags: any[] = [];
}
