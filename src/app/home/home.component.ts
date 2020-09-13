import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CityDataService} from "../city-data.service";
import {CityDatas} from "../models/city-datas";
import {element} from "protractor";


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
    if (!!event.formatted_address) {
      this.selectedAddress = event;
    }
  }


  goto() {
      if (this.selectedAddress) {
          const addressComponents = this.selectedAddress.address_components;
          let zipcode = '';
          addressComponents.forEach( (elem) => {
                elem.types.forEach((type) => {
                  if (type === 'postal_code') {
                    zipcode = elem.long_name;
                  }
                });
          });
          console.log(this.selectedAddress);
          console.log(zipcode);
          const cityDatas1 = {
            formatted: this.selectedAddress.formatted_address,
            name: this.selectedAddress.name,
            city: this.selectedAddress.vicinity,
            zipCode: zipcode
            };

          console.log(cityDatas1);
          this.cityData.setCityData(cityDatas1);
          this.route.navigate(['/restaurants-city']);
      }
  }




}
