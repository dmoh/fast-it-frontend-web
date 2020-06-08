import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeolocService {

    urlWebAccess: string = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyBWmsbtovl5UfDKuGgxhFF0GTCjz842OUU'; // todo check url environment.webaccessUrl;

    constructor() { }
}
