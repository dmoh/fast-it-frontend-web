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
  isSave : boolean;


  ngOnInit(): void {
    this.userName = "Mohamed";
    this.lastName = "Kanoute";
    this.phone = "0661234567";
    this.isKbis = true;
    this.isSave = false;

    this.deliveryService.getInfosDeliverer()
      .subscribe((delivererCurrent) => {
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
          siret: [this.siret, Validators.required],
        });
      });

  }

  async saveDelivererInfo() {
    // https://entreprise.data.gouv.fr/api/sirene/v1/siret/
    console.warn("Await ", await this.delivererForm.value.siret);
    this.deliveryService.getKbis(this.delivererForm.value.siret).subscribe(
      (res) => {
        console.warn("response", res);
        this.isKbis = (res.etablissement.siret == this.delivererForm.value.siret.toString());
      },
      (err) => {
        console.log(err);
        this.isKbis = false;
      }
    );

    this.isSave = true && this.isKbis;

    // this.deliveryService.saveDeliverer().subscribe();      

  }

}
