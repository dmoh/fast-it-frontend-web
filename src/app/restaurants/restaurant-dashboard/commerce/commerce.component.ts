import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {RestaurantDashboardComponent} from '@app/restaurants/restaurant-dashboard/restaurant-dashboard.component';
import {RestaurantDashboardService} from '@app/restaurants/restaurant-dashboard/services/restaurant-dashboard.service';
import {Restaurant} from "@app/_models/restaurant";
import {UploadService} from "@app/_services/upload.service";
import {NgxMaterialTimepickerTheme} from "ngx-material-timepicker";
import {Schedule} from "@app/_models/schedule";

@Component({
  selector: 'app-commerce',
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
              private uploadService: UploadService
  ) {
    this.showScheduleByWeek = false;
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
    this.restaurantService.getRestaurantDatas(1).subscribe((res) => {
      this.commerce = RestaurantDashboardComponent.extractRestaurantData('business', res);
      console.warn(this.commerce);
      this.commerceForm = this.formBuilder.group({
        name: [this.commerce.name, Validators.required],
        number: [this.commerce.number, [Validators.required, Validators.minLength(10)]],
        description: this.commerce.description,
        street: [this.commerce.street, Validators.required],
        emailContact: [this.commerce.emailContact, Validators.required],
        zipcode: [this.commerce.zipcode, Validators.required],
        city: [this.commerce.city, Validators.required],
        logo: [this.commerce.logo],
        backgroundImg: [this.commerce.backgroundImg],
        estimatedPreparationTime: [this.commerce.estimatedPreparationTime, Validators.required],
      });
      this.scheduleForm = this.formBuilder.group({
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
        sundayEndAllDay: [this.scheduleRestaurant.sundayEndAllDay]
      });
    });
  }

  ngAfterViewInit() {

  }

  onChangeSchedule() {
    console.warn(this.showScheduleByWeek);
    this.showScheduleByWeek = !this.showScheduleByWeek;
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
}
