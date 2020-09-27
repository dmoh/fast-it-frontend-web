import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestaurantDashboardService } from '@app/restaurants/restaurant-dashboard/services/restaurant-dashboard.service';
import { Delivery } from '@app/_models/delivery';
import { DeliveryService } from '../services/delivery.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Order } from '@app/_models/order';

@Component({
  selector: 'app-detail-delivery',
  templateUrl: './detail-delivery.component.html',
  styleUrls: ['./detail-delivery.component.scss']
})
export class DetailDeliveryComponent implements OnInit {

  delivererForm: FormGroup;
  deliverer: Delivery;
  order: any;
  isValid: boolean;
  orderId: string;
  hasDeliveryCode: boolean = true;

  constructor(private fb: FormBuilder,
    private deliveryService: DeliveryService,
    private location: Location,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.isValid = true;
    this.orderId = this.route.snapshot.paramMap.get('id');
    this.deliveryService.getCurrentOrders()
    .subscribe((delivererCurrent) => {
      console.warn('delivererCurrent', delivererCurrent);
      this.deliverer = delivererCurrent[0];
      this.delivererForm = this.fb.group({
        code: ["", Validators.required],
        notCode: false
      });
      this.order = this.deliverer.orders.filter(order => order.id == this.orderId)[0];
      console.log("order", this.order);
      this.hasDeliveryCode = this.order.deliverCode != null;
      });

  }

  validateDelivery(): void {
    console.warn("form values", this.delivererForm.value);
    
    if (this.hasDeliveryCode) {
      this.isValid = this.delivererForm.value.code === this.order.deliverCode;
      console.log(this.isValid)
    }

    if (this.delivererForm.value.notCode || this.isValid) {
      // order validate 
      // return at awaiting
      this.finalizeDelivery() ;
      this.location.back();
    }
    else {
      return;
    }
  }

  validateWithoutCode() {
    this.delivererForm.value.notCode = true;
  }

  finalizeDelivery() {
    let order: any;
    let dateDelivered = Date.now();
    order = { order : {
      order_id: this.orderId,
      deliverer_id: this.deliverer.id,
      date_delivered: dateDelivered,
    }
  };
    console.log(order);
    this.deliveryService.sendDelivererCode(order).subscribe();
  }

}
