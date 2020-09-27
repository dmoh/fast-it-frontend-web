import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {User} from "@app/_models/user";
import {CustomerService} from "@app/customer/_services/customer.service";

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
  customerForm: FormGroup;
  customer: User;
  constructor(private fb: FormBuilder, private customerService: CustomerService) { }

  ngOnInit(): void {
    this.customerService.getInfosCustomer()
      .subscribe((customerCurrent) => {
        this.customer = customerCurrent[0];
        this.customerForm = this.fb.group({
          email: [this.customer.email, Validators.required],
          city: [this.customer.addresses[0].city, Validators.required],
          zipcode: [this.customer.addresses[0].zipcode, Validators.required],
          street: [this.customer.addresses[0].street, Validators.required],
        });
      });

  }

}
