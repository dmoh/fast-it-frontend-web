import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {RestaurantDashboardComponent} from '@app/restaurants/restaurant-dashboard/restaurant-dashboard.component';
import {RestaurantDashboardService} from '@app/restaurants/restaurant-dashboard/services/restaurant-dashboard.service';
import {Restaurant} from "@app/_models/restaurant";
import {Delivery} from "@app/_models/delivery";
import {UploadService} from "@app/_services/upload.service";

@Component({
  selector: 'app-my-delivery',
  templateUrl: './my-delivery.component.html',
  styleUrls: ['./my-delivery.component.scss']
})
export class MyDeliveryComponent implements OnInit, AfterViewInit {
  commerceForm: FormGroup;
  commerceGroup: FormGroup;
  commerce: Restaurant;
  delivery: Delivery;
  error: string;
  uploadResponse = { status: '', message: '', filePath: '' };
  schedulePrepartionTimes: any[] = [];


  constructor(private formBuilder: FormBuilder,
              private restaurantService: RestaurantDashboardService,
              private uploadService: UploadService
  ) {
    this.schedulePrepartionTimes = [
      {
        value: '20,30',
        label: '20 - 30'
      },
      {
        value: '30,40',
        label: '30 - 40'
      },
      {
        value: '40,50',
        label: '40 - 50'
      },
      {
        value: '50,60',
        label: '50 - 60'
      }
    ];
  }

  ngOnInit(): void {
    console.warn('get my deliveries', this.delivery);
    
    this.restaurantService.getOrdersDatas(1).subscribe((res) => {
      this.commerce = RestaurantDashboardComponent.extractRestaurantData('business', res);
      console.warn(this.commerce);
      this.commerceForm = this.formBuilder.group({
        name: [this.commerce.name, Validators.required],
        description: this.commerce.description,
        street: [this.commerce.street, Validators.required],
        emailContact: [this.commerce.emailContact, Validators.required],
        zipcode: [this.commerce.zipcode, Validators.required],
        city: [this.commerce.city, Validators.required],
        logo: [this.commerce.logo],
        backgroundImg: [this.commerce.backgroundImg],
        estimatedPreparationTime: [this.commerce.estimatedPreparationTime, Validators.required],
      });
    });
  }

  ngAfterViewInit() {

  }

  onSubmit() {
    const formData = new FormData();
    this.commerce = Object.assign(this.commerce, this.commerceForm.value);
    if (this.commerce.logo) {
      delete(this.commerce.logo);
    }
    if (this.commerce.backgroundImg) {
      delete(this.commerce.backgroundImg);
    }

    formData.append('business', JSON.stringify(this.commerce));
    formData.append('logo', this.commerceForm.get('logo').value);
    formData.append('backgroundImg', this.commerceForm.get('backgroundImg').value);
    this.uploadService.upload(formData, this.commerce.id).subscribe(
      (res) => this.uploadResponse = res,
      (err) => this.error = err
    );

  }

  onFileChange(event, type) {
    if (event.target.files.length > 0) {
      if ( type === 'logo') {
        const file = event.target.files[0];
        this.commerceForm.get('logo').setValue(file);
      } else {
        const file = event.target.files[0];
        this.commerceForm.get('backgroundImg').setValue(file);
      }

    }
  }


  onSelectedPrep(event) {
    console.log(event);
  }

}
