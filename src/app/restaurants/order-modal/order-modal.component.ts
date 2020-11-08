import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {JwtInterceptor} from "@app/_helpers/jwt.interceptor";
import { Order } from '@app/_models/order';
import { Restaurant } from '@app/_models/restaurant';
import { RestaurantDashboardService } from '../restaurant-dashboard/services/restaurant-dashboard.service';

@Component({
  selector: 'app-order-modal',
  templateUrl: './order-modal.component.html',
  styleUrls: ['./order-modal.component.scss']
})
export class OrderModalComponent implements OnInit {

  @Input() products: any[];
  @Input() order: Order;
  @Input() business: Restaurant;
  @Input() additionalInfo: string;

  public orders: any[] = new Array();
  public message ="";

  constructor(private route: ActivatedRoute,
              private restaurantService: RestaurantDashboardService,
              // private jwtInterceptor: JwtInterceptor
              ) { }

  ngOnInit(): void {

    if (this.products) {
      this.products.forEach( product => {
        let currentOrder: any = {
          quantity: "",
          product: "",
        };
        currentOrder.quantity = product.split(" ")[0];
        currentOrder.product = product.split(" ")[1];
        currentOrder.amount = this.order.amount;
        this.orders.push(currentOrder);
      });
    }

  }

  onValidate(time: string) {
    // todo save commercant
    console.log("this.business", this.business);
    let dataOrder: any = {
      order_id: this.order.id,
      order_accepted_by_merchant: true,
      status: "en cours de preparation",
      business_id: this.business.id,
      time,
    };
    // todo accept Order
    this.restaurantService.acceptOrder(dataOrder).subscribe();
    // todo response-merchant
    this.restaurantService.saveResponseMerchant(dataOrder).subscribe();
  }

  onRefuseOrder(message: string) {
    // avertir client
    // pourquoi refus ??
    let dataOrder: any = {
      order_id: this.order.id,
      order_accepted_by_merchant: false,
      status: "commande annulé",
      business_id: null,
      message,
    };
    console.log("dataOrder", dataOrder);
    this.restaurantService.refuseOrder(dataOrder).subscribe();
  }

}
