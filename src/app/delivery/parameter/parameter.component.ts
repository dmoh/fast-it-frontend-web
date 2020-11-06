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
  siret: string;
  isKbis: boolean;
  isSave: boolean;


  ngOnInit(): void {
    this.isKbis = true;
    this.isSave = false;
    this.deliverer = new Delivery();

    this.deliveryService.getInfosDeliverer()
      .subscribe((delivererCurrent) => {
        this.deliverer = delivererCurrent[0];
        if ( this.deliverer.email === 'mkanoute74@gmail.com') {
          this.deliverer.firstname = 'Mohamed';
          this.deliverer.lastname = 'Kanoute';
          this.deliverer.phone = '0661234567';
        }

        this.delivererForm = this.fb.group({
          userName: [this.deliverer.firstname, Validators.required],
          lastName: [this.deliverer.lastname, Validators.required],
          phone: [this.deliverer.phone, Validators.required],
          email: [this.deliverer.email, Validators.required],
          city: [this.deliverer.addresses[0].city, Validators.required],
          zipcode: [this.deliverer.addresses[0].zipcode, Validators.required],
          street: [this.deliverer.addresses[0].street, Validators.required],
          workingTime: [this.deliverer.workingTime, Validators.required],
          workingTimeTwo: [this.deliverer.workingTimeTwo, Validators.required],
          siret: [this.siret, Validators.required],
        });
      });

  }

  async saveDelivererInfo() {
    // // https://entreprise.data.gouv.fr/api/sirene/v1/siret/
    // console.warn("Await ", await this.delivererForm.value.siret);
    
    // todo kbis a sauvegarder
    this.deliveryService.getKbis(this.delivererForm.value.siret).subscribe(
      (res) => {
        // console.warn('response', res);
        this.isKbis = (res.etablissement.siret === this.delivererForm.value.siret.toString());
        this.isSave = (true && this.isKbis);
      },
      (err) => {
        console.log('error', err);
        this.isKbis = false;
      }
    );
  }

}
