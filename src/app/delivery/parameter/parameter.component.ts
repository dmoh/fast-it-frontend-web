import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Delivery } from '@app/_models/delivery';
import { DeliveryService } from '../services/delivery.service';

@Component({
  selector: 'app-parameter',
  templateUrl: './parameter.component.html',
  styleUrls: ['./parameter.component.scss']
})
export class ParameterComponent implements OnInit {
  delivererForm: FormGroup;
  deliverer: Delivery;
  constructor(private fb: FormBuilder, private deliveryService: DeliveryService) { }

  userName: string;
  lastName: string;
  phone: string;

  ngOnInit(): void {
    this.userName = "Mohamed";
    this.lastName = "Kanoute";
    this.phone = "0661234567";

    this.deliveryService.getInfosDeliverer()
      .subscribe((delivererCurrent) => {
        console.warn("deliv before", delivererCurrent);
        this.deliverer = delivererCurrent[0];
        this.delivererForm = this.fb.group({
          userName: [this.userName, Validators.required],
          lastName: [this.lastName, Validators.required],
          phone: [this.phone, Validators.required],
          email: [this.deliverer.email, Validators.required],
          city: [this.deliverer.addresses[0].city, Validators.required],
          zipcode: [this.deliverer.addresses[0].zipcode, Validators.required],
          street: [this.deliverer.addresses[0].street, Validators.required],
          workingTime: [this.deliverer.workingTime, Validators.required],
          workingTimeTwo: [this.deliverer.workingTimeTwo, Validators.required],
        });
      });

  }

}
