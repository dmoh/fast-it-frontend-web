import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {User} from "@app/_models/user";

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
  customerForm: FormGroup;
  customer: User;
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      street: [this.customer.street, Validators.required],
      city: [this.customer.city, Validators.required],
      zipcode: [this.customer.zipcode, Validators.required],
    });
  }

}
