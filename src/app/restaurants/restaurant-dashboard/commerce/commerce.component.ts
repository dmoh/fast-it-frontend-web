import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {RestaurantDashboardComponent} from '@app/restaurants/restaurant-dashboard/restaurant-dashboard.component';
import {RestaurantDashboardService} from '@app/restaurants/restaurant-dashboard/services/restaurant-dashboard.service';
import {Restaurant} from "@app/_models/restaurant";

@Component({
  selector: 'app-commerce',
  templateUrl: './commerce.component.html',
  styleUrls: ['./commerce.component.scss']
})
export class CommerceComponent implements OnInit, AfterViewInit {
  commerceForm: FormGroup;
  commerceGroup: FormGroup;
  commerce: Restaurant;


  constructor(private formBuilder: FormBuilder,
              private restaurantService: RestaurantDashboardService) {

  }

  ngOnInit(): void {
    this.restaurantService.getOrdersDatas(1).subscribe((res) => {
      this.commerce = RestaurantDashboardComponent.extractRestaurantData('business', res);
      console.warn(this.commerce);
    });


  }

  ngAfterViewInit() {
    this.commerceGroup = this.formBuilder.group({
      name: [this.commerce.name, Validators.required],
      address: [this.commerce.name, Validators.required],
      email_contact: [this.commerce.name, Validators.required],
      zipcode: [this.commerce.name, Validators.required],
      city: [this.commerce.name, Validators.required],
    });
  }

  onSubmit() {

  }

}
