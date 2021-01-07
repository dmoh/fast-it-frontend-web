import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {RestaurantDashboardService} from "@app/restaurants/restaurant-dashboard/services/restaurant-dashboard.service";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  contactForm: FormGroup;
  constructor(private fb: FormBuilder,
              private snackbar: MatSnackBar,
              private restaurantDashboardService: RestaurantDashboardService
              ) { }

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      subject: '',
      message: ['', [Validators.required, Validators.minLength(20)]]
    });
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      return;
    }
    const contact = {
      subject: this.contactForm.value.subject,
      message: this.contactForm.value.message
    };
    // this.restaurantDashboardService


  }

}
