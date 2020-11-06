import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {RestaurantDashboardComponent} from '@app/restaurants/restaurant-dashboard/restaurant-dashboard.component';
import {RestaurantDashboardService} from '@app/restaurants/restaurant-dashboard/services/restaurant-dashboard.service';
import {Restaurant} from '@app/_models/restaurant';
import {UploadService} from '@app/_services/upload.service';
import {NgxMaterialTimepickerTheme} from 'ngx-material-timepicker';
import {Schedule} from '@app/_models/schedule';
import {Router} from '@angular/router';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
@Component({
  selector: 'app-edit-commerce',
  templateUrl: './edit-commerce.component.html',
  styleUrls: ['./edit-commerce.component.scss']
})
export class EditCommerceComponent implements OnInit {
  commerceForm: FormGroup;
  @Input() commerce: Restaurant;
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
              private modalActive: NgbActiveModal
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
    this.showScheduleByWeek = false;
    if (this.commerce.id > 0) {
      this.restaurantService.getRestaurantDatas(this.commerce.id).subscribe((res) => {
        this.commerce = RestaurantDashboardComponent.extractRestaurantData('business', res);
        this.createCommerceForm();
      });
    } else {
      this.createCommerceForm();
    }
  }

  createCommerceForm() {
    this.commerceForm = this.formBuilder.group({
      name: new FormControl({value: this.commerce.name, disabled: false}, Validators.required),
      number: [this.commerce.number, [Validators.required, Validators.minLength(10)]],
      description: this.commerce.description,
      street: [this.commerce.street, Validators.required],
      emailContact: [this.commerce.emailContact, Validators.required],
      numSiret: [this.commerce.numSiret],
      numSiren: [this.commerce.numSiren],
      zipcode: [this.commerce.zipcode, Validators.required],
      city: [this.commerce.city, Validators.required],
      logo: [this.commerce.logo],
      backgroundImg: [this.commerce.backgroundImg],
      estimatedPreparationTime: [this.commerce.estimatedPreparationTime, Validators.required],
    });
  }

  onChangeSchedule() {
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
        this.modalActive.close('ok');
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

}
