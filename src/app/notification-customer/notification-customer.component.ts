import { Component, OnInit } from '@angular/core';
import {CustomerService} from "@app/customer/_services/customer.service";

@Component({
  selector: 'app-notification-customer',
  templateUrl: './notification-customer.component.html',
  styleUrls: ['./notification-customer.component.scss']
})
export class NotificationCustomerComponent implements OnInit {

  notifications: any[];
  constructor(private customerService: CustomerService) { }

  ngOnInit(): void {
    this.customerService.getNotificationsCustomer()
      .subscribe((notif) => {
        this.notifications = notif;
      });
  }

}
