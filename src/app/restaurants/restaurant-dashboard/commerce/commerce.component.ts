import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {RestaurantDashboardComponent} from '@app/restaurants/restaurant-dashboard/restaurant-dashboard.component';
import {RestaurantDashboardService} from '@app/restaurants/restaurant-dashboard/services/restaurant-dashboard.service';
import {Restaurant} from "@app/_models/restaurant";
import {UploadService} from "@app/_services/upload.service";
import {NgxMaterialTimepickerTheme} from "ngx-material-timepicker";
import {Schedule} from "@app/_models/schedule";
import {Router} from "@angular/router";
import {SecurityRestaurantService} from "@app/_services/security-restaurant.service";

@Component({
  selector: 'app-commerce-restaurant',
  templateUrl: './commerce.component.html',
  styleUrls: ['./commerce.component.scss']
})
export class CommerceComponent implements OnInit, AfterViewInit {
  commerceForm: FormGroup;
  commerce: Restaurant;
  scheduleRestaurant: Schedule = new Schedule();
  error: string;
  showScheduleByWeek: boolean;
  darkTheme: NgxMaterialTimepickerTheme = {
    container: {
      bodyBackgroundColor: '#424242',
      buttonColor: '#fff'
    },
    dial: {
      dialBackgroundColor: '#555',
    },
    clockFace: {
      clockFaceBackgroundColor: '#555',
      clockHandColor: '#9fbd90',
      clockFaceTimeInactiveColor: '#fff'
    }
  };
  scheduleForm: FormGroup;
  uploadResponse = { status: '', message: '', filePath: '' };
  schedulePrepartionTimes: any[] = [];
  panelOpenState = false;

  constructor(private formBuilder: FormBuilder,
              private restaurantService: RestaurantDashboardService,
              private uploadService: UploadService,
              private router: Router,
              private securityRestaurantService: SecurityRestaurantService
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
    this.securityRestaurantService.getRestaurant().subscribe((restaurantObj) => {
      this.showScheduleByWeek = false;
      this.restaurantService.getRestaurantDatas(restaurantObj.id).subscribe((res) => {
        this.commerce = RestaurantDashboardComponent.extractRestaurantData('business', res);
        if (this.commerce === null) {
          this.restaurantService.getRestaurantInfosById(restaurantObj.id)
            .subscribe((restaurantDb) => {
              this.commerce = restaurantDb.restaurant;
              this.generateCommerceForm();
            });
        } else {
          this.generateCommerceForm();
        }

        /*this.scheduleForm = this.formBuilder.group({
          mondayStartMorning: [this.scheduleRestaurant.mondayStartMorning],
          mondayEndMorning: [this.scheduleRestaurant.mondayEndMorning],
          mondayStartNight: [this.scheduleRestaurant.mondayStartNight],
          mondayEndNight: [this.scheduleRestaurant.mondayEndNight],
          mondayStartAllDay: [this.scheduleRestaurant.mondayStartAllDay],
          mondayEndAllDay: [this.scheduleRestaurant.mondayEndAllDay],
          tuesdayStartMorning: [this.scheduleRestaurant.tuesdayStartMorning],
          tuesdayEndMorning: [this.scheduleRestaurant.tuesdayEndMorning],
          tuesdayStartNight: [this.scheduleRestaurant.tuesdayStartNight],
          tuesdayEndNight: [this.scheduleRestaurant.tuesdayEndNight],
          tuesdayStartAllDay: [this.scheduleRestaurant.tuesdayStartAllDay],
          tuesdayEndAllDay: [this.scheduleRestaurant.tuesdayEndAllDay],
          wednesdayStartMorning: [this.scheduleRestaurant.wednesdayStartMorning],
          wednesdayEndMorning: [this.scheduleRestaurant.wednesdayEndMorning],
          wednesdayStartNight: [this.scheduleRestaurant.wednesdayStartNight],
          wednesdayEndNight: [this.scheduleRestaurant.wednesdayEndNight],
          wednesdayStartAllDay: [this.scheduleRestaurant.wednesdayStartAllDay],
          wednesdayEndAllDay: [this.scheduleRestaurant.wednesdayEndAllDay],
          thursdayStartMorning: [this.scheduleRestaurant.thursdayStartMorning],
          thursdayEndMorning: [this.scheduleRestaurant.thursdayEndMorning],
          thursdayStartNight: [this.scheduleRestaurant.thursdayStartNight],
          thursdayEndNight: [this.scheduleRestaurant.thursdayEndNight],
          thursdayStartAllDay: [this.scheduleRestaurant.thursdayStartAllDay],
          thursdayEndAllDay: [this.scheduleRestaurant.thursdayEndAllDay],
          fridayStartMorning: [this.scheduleRestaurant.fridayStartMorning],
          fridayEndMorning: [this.scheduleRestaurant.fridayEndMorning],
          fridayStartNight: [this.scheduleRestaurant.fridayStartNight],
          fridayEndNight: [this.scheduleRestaurant.fridayEndNight],
          fridayStartAllDay: [this.scheduleRestaurant.fridayStartAllDay],
          fridayEndAllDay: [this.scheduleRestaurant.fridayEndAllDay],
          saturdayStartMorning: [this.scheduleRestaurant.saturdayStartMorning],
          saturdayEndMorning: [this.scheduleRestaurant.saturdayEndMorning],
          saturdayStartNight: [this.scheduleRestaurant.saturdayStartNight],
          saturdayEndNight: [this.scheduleRestaurant.saturdayEndNight],
          saturdayStartAllDay: [this.scheduleRestaurant.saturdayStartAllDay],
          saturdayEndAllDay: [this.scheduleRestaurant.saturdayEndAllDay],
          sundayStartMorning: [this.scheduleRestaurant.sundayStartMorning],
          sundayEndMorning: [this.scheduleRestaurant.sundayEndMorning],
          sundayStartNight: [this.scheduleRestaurant.sundayStartNight],
          sundayEndNight: [this.scheduleRestaurant.sundayEndNight],
          sundayStartAllDay: [this.scheduleRestaurant.sundayStartAllDay],
          sundayEndAllDay: [this.scheduleRestaurant.sundayEndAllDay],
          allDaysStartMorning: [this.scheduleRestaurant.allDaysStartMorning],
          allDaysEndMorning:   [this.scheduleRestaurant.allDaysEndMorning],
          allDaysStartNight:   [this.scheduleRestaurant.allDaysStartNight],
          allDaysEndNight:     [this.scheduleRestaurant.allDaysEndNight],
          allDaysStartAllDay:  [this.scheduleRestaurant.allDaysStartAllDay],
          allDaysEndAllDay:    [this.scheduleRestaurant.allDaysEndAllDay]
        });*/
      });
    });

  }

  ngAfterViewInit() {}

  onChangeSchedule() {
    this.showScheduleByWeek = !this.showScheduleByWeek;
  }
  onSubmit() {
    const formData = new FormData();
    this.commerce = Object.assign(this.commerce, this.commerceForm.value);
    if (this.commerce.description === null) {
      this.commerce.description = '';
    }
    if (this.commerce.logo) {
      delete(this.commerce.logo);
    }
    if (this.commerce.backgroundImg) {
      delete(this.commerce.backgroundImg);
    }
    /*if (this.scheduleForm.valid) {
      this.scheduleRestaurant = Object.assign(this.scheduleRestaurant, this.scheduleForm.value);
      formData.append('schedule', JSON.stringify(this.scheduleRestaurant));
    }*/
    formData.append('business', JSON.stringify(this.commerce));
    formData.append('logo', this.commerceForm.get('logo').value);
    formData.append('backgroundImg', this.commerceForm.get('backgroundImg').value);
    this.uploadService.upload(formData, this.commerce.id).subscribe(
      (res) => {
         this.uploadResponse = res;
         this.router.navigate(['commerce']);
      },
      (err) => this.error = err
    );

  }

  onChangeHour(event) {
    console.log(event);
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



  generateCommerceForm() {
    this.commerceForm = this.formBuilder.group({
      name: [this.commerce.name, Validators.required],
      number: [this.commerce.phone, [Validators.required, Validators.minLength(10)]],
      description: this.commerce.description,
      street: [this.commerce.street, Validators.required],
      // phone: [this.commerce.phone, Validators.required],
      emailContact: [this.commerce.emailContact, Validators.required],
      numSiret: [this.commerce.numSiret],
      numSiren: [this.commerce.numSiren],
      zipcode: [this.commerce.zipcode, Validators.required],
      city: [this.commerce.city, Validators.required],
      logo: [this.commerce.logo],
      backgroundImg: [this.commerce.backgroundImg],
      estimatedPreparationTime: [this.commerce.estimatedPreparationTime, Validators.required],
    });

    this.commerceForm.patchValue({ estimatedPreparationTime: this.commerce.estimatedPreparationTime});
  }


}
