import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {User} from '@app/_models/user';
import {CustomerService} from '@app/customer/_services/customer.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
  customerForm: FormGroup;
  customer: User;
  fd: FormData = new FormData();
  photoCustomer: any;
  constructor(private fb: FormBuilder, private customerService: CustomerService) { }

  ngOnInit(): void {
    this.customerService.getInfosCustomer()
      .subscribe((customerCurrent) => {
        this.customer = customerCurrent[0];
        this.customerForm = this.fb.group({
          email: [this.customer.email, Validators.required],
          phone: [this.customer.phone],
          city: [this.customer.addresses[0].city, Validators.required],
          zipcode: [this.customer.addresses[0].zipcode, Validators.required],
          street: [this.customer.addresses[0].street, Validators.required],
        });
      });

  }

  onUploadFile(event) {
    const photo = event.target.files[0];
    if (photo) {
      this.photoCustomer = photo;
    }
  }
  onSubmit() {
    if (this.customerForm.invalid) {
      return; // todo afficher erreur form
    }
    this.customer = Object.assign(this.customer, this.customerForm.value);
    if (this.customer.notifications) {
      delete this.customer.notifications;
    }

    if (this.customer.orders) {
      delete this.customer.orders;
    }
    this.fd.append('customer', JSON.stringify(this.customer));
    if (this.photoCustomer) {
      this.fd.append('photo', this.photoCustomer);
    }

    this.customerService.editCustomer(this.fd)
      .subscribe((res) => {
        console.warn(res) ;
      });
  }

}
