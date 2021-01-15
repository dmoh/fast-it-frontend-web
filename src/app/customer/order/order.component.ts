import { Component, OnInit } from '@angular/core';
import {User} from '@app/_models/user';
import {CustomerService} from '@app/customer/_services/customer.service';
import * as fasteatconst from '@app/_util/fasteat-constants';
import {Order} from '@app/_models/order';
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  customer: User = new User();
  fastEatConst = fasteatconst;
  constructor(private customerService: CustomerService) { }

  ngOnInit(): void {
    this.customerService.getOrdersCustomer()
      .subscribe((response) => {
        this.customer.orders = response;
      });
  }

  onShowOrder(order: Order) {

  }

}
