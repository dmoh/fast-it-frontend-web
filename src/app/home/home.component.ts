import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router'
import {CityDataService} from "../city-data.service";
import {CityDatas} from "../models/city-datas";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  options: {} = {};
  selectedAddress: any;
  constructor(
              private route: Router,
              private cityData: CityDataService
              ) { }

  ngOnInit(): void {
    this.options = {
        types: [],
        componentRestrictions: { country: 'FR' }
    };
  }

  ngOnDestroy(): void {

  }

  handleAddressChange(event) {
    if(!!event.formatted_address) {
      this.selectedAddress = event;
    }
  }


  goto() {
      if(this.selectedAddress) {
          const cityDatas = new CityDatas(
              this.selectedAddress.formatted_address,
              this.selectedAddress.name
          );
          this.cityData.setCityData(cityDatas);
          this.route.navigate(['/restaurants-city']);
      }
  }




}
