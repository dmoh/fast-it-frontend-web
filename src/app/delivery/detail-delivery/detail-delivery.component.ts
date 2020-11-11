import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestaurantDashboardService } from '@app/restaurants/restaurant-dashboard/services/restaurant-dashboard.service';
import { Delivery } from '@app/_models/delivery';
import { DeliveryService } from '../services/delivery.service';
import { ActivatedRoute, Router, RouterState } from '@angular/router';
import { Order } from '@app/_models/order';

@Component({
  selector: 'app-detail-delivery',
  templateUrl: './detail-delivery.component.html',
  styleUrls: ['./detail-delivery.component.scss']
})
export class DetailDeliveryComponent implements OnInit {

  delivererForm: FormGroup;
  order: any;
  isValid: boolean;
  orderId: string;
  hasDeliveryCode: boolean = true;

  constructor(private fb: FormBuilder,
    private deliveryService: DeliveryService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.isValid = true;
    this.orderId = this.route.snapshot.paramMap.get('id');

    this.deliveryService.getOrderById(+this.orderId).subscribe( order => {
      // let order: Order = new Order();

      this.order = order;
        
      this.hasDeliveryCode = this.order.deliverCode != null;
      
      this.delivererForm = this.fb.group({
        code: ["", Validators.required],
        notCode: false
      });
    });    
  }

  validateDelivery(): void {
    if (this.hasDeliveryCode) {
      this.isValid = this.delivererForm.value.code === this.order.deliverCode;
    }

    if (this.delivererForm.value.notCode || this.isValid) {
      this.finalizeDelivery();
      this.router.navigate(['/delivery/awaiting-delivery']);
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
    let dateDelivered = '@' + Math.round(Date.now()/1000) ;
    alert(dateDelivered);
    
    order = { 
      order : {
        order_id: this.orderId,
        date_delivered: dateDelivered,
        status: 4,
      }
    };
    this.deliveryService.saveOrderFinal(order).subscribe();
  }

}
