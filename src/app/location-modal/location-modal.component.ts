import { Component, OnInit } from '@angular/core';
import {RestaurantsCityComponent} from "@app/restaurants-city/restaurants-city.component";
import {CityDataService} from "@app/city-data.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-location-modal',
  templateUrl: './location-modal.component.html',
  styleUrls: ['./location-modal.component.scss']
})
export class LocationModalComponent implements OnInit {
  cityDatas: any;
  selectedAddress: any;
  options: {} = {};
  showInput: boolean = false;

  constructor(private cityDataService: CityDataService,
              public modalActive: NgbActiveModal
              ) { }

  ngOnInit(): void {
    this.cityDatas = RestaurantsCityComponent.getCityFromStorage();
    this.options = {
      types: [],
      componentRestrictions: { country: 'FR' }
    };
  }

  handleAddressChange(event) {
    if (!!event.formatted_address) {
      this.selectedAddress = event;
    }
  }


  onShowInput() {
    this.showInput = !this.showInput;
  }

  onValidateLocation() {
    if (this.selectedAddress) {
      const locationDatas = {city: '', zipCode: '', name: ''};
      const addressComponent = this.selectedAddress.address_components;
      if (addressComponent.length > 0) {
        addressComponent.forEach((elem) => {
          if (elem.types) {
            const typeArea = elem.types;
            switch (typeArea[0]) {
              case 'locality':
                locationDatas.city = elem.long_name;
                locationDatas.name = elem.long_name;
                break;
              case 'postal_code':
                locationDatas.zipCode = elem.long_name;
                break;
            }
          }
        });
        this.cityDataService.setCityData(locationDatas);
        this.modalActive.close('updated');
      }
    }
  }

}
