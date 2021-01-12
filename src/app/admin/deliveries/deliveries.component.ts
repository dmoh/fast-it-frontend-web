import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import {AdminService} from '@app/admin/admin.service';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AssignedDeliveryModalComponent} from "@app/admin/assigned-delivery-modal/assigned-delivery-modal.component";
import {MatSnackBar} from "@angular/material/snack-bar";


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

  constructor(
    private adminService: AdminService,
    private modal: NgbModal,
    private snackBar: MatSnackBar
              ) {
  }

  ngOnInit(): void {
    this.getDeliveriesDb();

    const source = timer(4000, 7000);

    const subscribe = source.subscribe(val => {
      this.second = val;
      this.getDeliveriesDb();
    });
    setTimeout(() => {
      subscribe.unsubscribe();
    }, 1000000);
  }


  private getDeliveriesDb() {
    this.adminService.getDeliveries()
      .subscribe((response) => {
        this.deliveriesAttemptingByRestaurant = [];
        if (response.deliveriesAttemptingByRestaurant) {
          this.deliveriesAttemptingByRestaurant = response.deliveriesAttemptingByRestaurant;
        }
        this.deliveriesAttemptingByDeliverers = [];
        if (response.deliveriesAttemptingByDeliverers) {
          this.deliveriesAttemptingByDeliverers = response.deliveriesAttemptingByDeliverers;
        }
        this.deliveriesTakenByDeliverer = [];
        if (typeof response.deliveriesTakenByDeliverer !== 'undefined') {
          this.deliveriesTakenByDeliverer = response.deliveriesTakenByDeliverer;
          /*if (this.deliveriesAttemptingByDeliverers && this.deliveriesAttemptingByDeliverers.length > 0) {
            this.deliveriesAttemptingByDeliverers = this.deliveriesAttemptingByDeliverers.filter((elem) => {
              const index = this.deliveriesTakenByDeliverer.findIndex(order => +order.order_id === +elem.order_id);
              if (index === -1) {
                return elem;
              }
            });
          }*/
        }
        this.deliveriesEnded = [];
        if (response.deliveriesEnded) {
          this.deliveriesEnded = response.deliveriesEnded;
        }
        this.deliveriesRefused = [];
        if (response.deliveriesRefused) {
          this.deliveriesRefused = response.deliveriesRefused;
        }
        if (response.deliveriesDay) {
          this.deliveriesDay = response.deliveriesDay;
        }
      });
  }

  onAssignedDeliverer(orderDelivery: any): void {
   const modalRef = this.modal.open(AssignedDeliveryModalComponent);
   modalRef.componentInstance.orderDelivery = orderDelivery;
   modalRef.result.then((res) => {
     if (res) {
       this.snackBar.open('Assigné avec succès', 'ok');
       this.getDeliveriesDb();
     }
   });
  }
}
