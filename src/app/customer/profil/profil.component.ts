import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {User} from '@app/_models/user';
import {CustomerService} from '@app/customer/_services/customer.service';
import {MatSnackBar} from "@angular/material/snack-bar";

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
  pass: string;
  confirmPass: string;
  error: string;
  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.customerService.getInfosCustomer()
      .subscribe((customerCurrent) => {
        this.customer = customerCurrent;
        if (this.customer.addresses.length === 0) {
          this.customer.addresses = [...this.customer.addresses, {
            city: '',
            zipCode: '',
            street: ''
          }];
        }
        this.customerForm = this.fb.group({
          email: [this.customer.email, Validators.required],
          phone: [this.customer.phone],
          city: [this.customer.addresses[0].city, Validators.required],
          zipcode: [this.customer.addresses[0].zipCode, Validators.required],
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
        this.showInfoUser('Mise à jour avec succès');
      });
  }


onChangePassword() {
    if (typeof this.pass === 'undefined') {
      this.showInfoUser('Mot de passe manquant');
      return;
    }
    if ( this.pass !== this.confirmPass) {
      this.showInfoUser('Les mots de passes ne sont pas identiques.');
      return;
    }
    if ( this.pass.length < 8) {
      this.showInfoUser('8 caractères minimum');
      return;
    }
    //  || this.pass.length < 8
    this.customerService.updatePassword(this.pass)
      .subscribe((res) => {
        if (res.ok) {
          this.pass = '';
          this.confirmPass = '';
          this.showInfoUser('Mot de passe modifié.');
        }
      });
  }


  private showInfoUser(message: string) {
    this.snackBar.open(message, 'ok', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
