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

    console.log("modal products",this.products);

    if (this.products) {
      this.products.forEach( product => {
        let currentOrder: any = {
          quantity: "",
          product: "",
        };
        console.log("split", product.split(" "));
        currentOrder.quantity = product.split(" ")[0];
        currentOrder.product = product.split(" ")[1];
        currentOrder.amount = this.order.amount;
        this.orders.push(currentOrder);
      });
      console.log("modal orders", this.orders);
    }

  }

  onValidate(time: string) {
    // todo save commercant
    let dataOrder: any = {
      order_id: this.order.id,
      order_accepted_by_merchant: true,
      status: "en cours de perparation",
      business_id: this.business.id,
      time,
    };
    // todo accept Order
    this.restaurantService.acceptOrder(dataOrder);
    // todo response-merchant
    this.restaurantService.saveResponseMerchant(dataOrder);
  }

  onRefuseOrder(message: string) {
    // avertir client
    // pourquoi refus ??
    let dataOrder: any = {
      order_id: this.order.id,
      order_accepted_by_merchant: false,
      status: "commande annulé",
      message,
    };
    this.restaurantService.refuseOrder(dataOrder);
  }

}
