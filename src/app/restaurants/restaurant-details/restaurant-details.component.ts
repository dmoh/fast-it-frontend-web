import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-restaurant-details',
  templateUrl: './restaurant-details.component.html',
  styleUrls: ['./restaurant-details.component.scss']
})
export class RestaurantDetailsComponent implements OnInit {

  starsRestaurant: any[] = [];
  constructor() { }

  ngOnInit(): void {
    this.starsRestaurant = [1, 3, 4, 5, 4];
  }

}
