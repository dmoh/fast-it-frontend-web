import { Component, OnInit } from '@angular/core';
import {User} from "@app/_models/user";
import {CustomerService} from "@app/customer/_services/customer.service";

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  customer: User;
  constructor(private customerService: CustomerService) { }

  ngOnInit(): void {
    this.customerService.getInfosCustomer()
      .subscribe((response) => {
        console.warn(response);
        this.customer = response[0];
      });
  }

}
