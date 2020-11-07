import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {JwtInterceptor} from "@app/_helpers/jwt.interceptor";
import { Order } from '@app/_models/order';

@Component({
  selector: 'app-order-modal',
  templateUrl: './order-modal.component.html',
  styleUrls: ['./order-modal.component.scss']
})
export class OrderModalComponent implements OnInit {

  @Input() products: any[];
  @Input() additionalInfo: string;

  public orders: any[];

  constructor(private route: ActivatedRoute,
              // private jwtInterceptor: JwtInterceptor
              ) { }

  ngOnInit(): void {
    console.log(this.products);
    this.products.forEach( product => {
      let order: any;
      order.quantity = product.split("")[0];
      order.product = product.split("")[1];
      this.orders.push(order);
    });
    console.log("modal orders", this.orders);
  }

  onValidate(time: string) {
    // todo save commercant
    // /response-merchant
  }

  onRefuseOrder() {
    // avertir client
    // pourquoi refus ??
  }

}
