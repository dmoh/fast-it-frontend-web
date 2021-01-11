import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import {AdminService} from "@app/admin/admin.service";


@Component({
  selector: 'app-deliveries',
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.scss']
})
export class DeliveriesComponent implements OnInit {
  second: number;
  deliveriesDay: string = '10/01/2021';
  deliveriesAttemptingByRestaurant: any[] = [];
  deliveriesAttemptingByDeliverers: any[] = [];
  deliveriesTakenByDeliverer: any[] = [];
  deliveriesEnded: any[] = [];
  deliveriesRefused: any[] = [];

  constructor(private adminService: AdminService) {
    /*const source = timer(1000, 1000);
    const subscribe = source.subscribe(val => this.second = val);
    setTimeout(() => {
       subscribe.unsubscribe();
    }, 9000);*/
  }

  ngOnInit(): void {
    this.getDeliveriesDb();

    const source = timer(4000, 20000);

    const subscribe = source.subscribe(val => {
      this.second = val;
      this.getDeliveriesDb();
      /*const or = +this.deliveriesAttemptingByRestaurant.length;
      this.adminService.updateDeliveries(
        this.deliveriesAttemptingByRestaurant[or - 2].order_id
      )
      .subscribe((res) => {
          if (res.deliveriesAttemptingByRestaurant) {
            res.deliveriesAttemptingByRestaurant.forEach((order) =>  {
              const ind = this.deliveriesAttemptingByRestaurant.findIndex((elem) => order.order_id === elem.order_id);
              if (ind === -1) {
                this.deliveriesAttemptingByRestaurant =  [...this.deliveriesAttemptingByRestaurant, order];
              }
            });
          }
        });*/
      // this.adminService.updateDeliveries()
    });
    setTimeout(() => {
      subscribe.unsubscribe();
    }, 1000000);

  }


  private getDeliveriesDb() {
    this.adminService.getDeliveries()
      .subscribe((response) => {
        if (response.deliveriesAttemptingByRestaurant) {
          this.deliveriesAttemptingByRestaurant = response.deliveriesAttemptingByRestaurant;
        }
        if (response.deliveriesAttemptingByDeliverers) {
          this.deliveriesAttemptingByDeliverers = response.deliveriesAttemptingByDeliverers;
        }
        if (typeof response.deliveriesTakenByDeliverer !== 'undefined') {
          this.deliveriesTakenByDeliverer = response.deliveriesTakenByDeliverer;
        }
        if (response.deliveriesEnded) {
          this.deliveriesEnded = response.deliveriesEnded;
        }
        if (response.deliveriesRefused) {
          this.deliveriesRefused = response.deliveriesRefused;
        }
        if (response.deliveriesDay) {
          this.deliveriesDay = response.deliveriesDay;
        }
      });
  }
}
