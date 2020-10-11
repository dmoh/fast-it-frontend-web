import { Component, OnInit } from '@angular/core';
import {User} from "@app/_models/user";
import {CustomerService} from "@app/customer/_services/customer.service";
import status from "@app/_util/fastEatConstants";
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  customer: User = new User();
  s: status;
  constructor(private customerService: CustomerService) { }

  ngOnInit(): void {
    this.customerService.getOrdersCustomer()
      .subscribe((response) => {
        this.customer.orders = response;
      });
  }

}
