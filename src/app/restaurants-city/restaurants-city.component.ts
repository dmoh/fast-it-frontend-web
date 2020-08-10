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
  constructor(
      private cityDataService: CityDataService,
      private route: Router
  ) { }

  ngOnInit(): void {
    this.cityDataService.getCityData().subscribe((city: CityDatas) => {

        this.citySelected = city;
        /*if( !this.citySelected) {
          this.route.navigate(['/home']);
        }*/
      }
    );


  }

}
