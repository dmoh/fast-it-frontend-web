import {Component, OnInit} from '@angular/core';
import {CityDataService} from "../city-data.service";
import {CityDatas} from "../models/city-datas";
import {Router} from "@angular/router";

@Component({
  selector: 'app-restaurants-city',
  templateUrl: './restaurants-city.component.html',
  styleUrls: ['./restaurants-city.component.scss']
})
export class RestaurantsCityComponent implements OnInit{

  citySelected: CityDatas;
  restaurants: any[];
  static getCityFromStorage() {
    if (localStorage.getItem('cityData')) {
      return JSON.parse(localStorage.getItem('cityData'));
    }
    return {};
  }
  constructor(
      private cityDataService: CityDataService,
      private route: Router
  ) { }

  ngOnInit(): void {
    this.cityDataService.getCityData().subscribe((city: CityDatas) => {
        this.citySelected = city;
        if (!this.citySelected.city && !this.citySelected.name ) {
            this.citySelected = RestaurantsCityComponent.getCityFromStorage();
            if (!this.citySelected.city && !this.citySelected.name ) {
              this.route.navigate(['/home']);
            }
        }
        if (this.citySelected.formattedAddress || this.citySelected.name) {
          this.cityDataService.getRestaurants(JSON.stringify(this.citySelected))
            .subscribe((result) => {
              this.restaurants = result;
            }, (error) => {
            console.log(error);
          });
        }
      }
    );


  }

}
