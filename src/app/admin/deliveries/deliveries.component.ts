import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription, timer} from 'rxjs';
import {AdminService} from '@app/admin/admin.service';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AssignedDeliveryModalComponent} from "@app/admin/assigned-delivery-modal/assigned-delivery-modal.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {RestaurantDashboardService} from "@app/restaurants/restaurant-dashboard/services/restaurant-dashboard.service";


@Component({
  selector: 'app-deliveries',
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.scss']
})
export class DeliveriesComponent implements OnInit, OnDestroy {
  second: number;
  deliveriesDay: string = '10/01/2021';
  deliveriesAttemptingByRestaurant: any[] = [];
  deliveriesAttemptingByDeliverers: any[] = [];
  deliveriesTakenByDeliverer: any[] = [];
  deliveriesEnded: any[] = [];
  deliveriesRefused: any[] = [];
  timerSubscription: Subscription;

  constructor(
    private adminService: AdminService,
    private modal: NgbModal,
    private snackBar: MatSnackBar,
    private restaurantService:  RestaurantDashboardService
              ) {
  }

  ngOnInit(): void {
    this.getDeliveriesDb();
    const source = timer(4000, 7000);
    this.timerSubscription = source.subscribe(val => {
      this.second = val;
      this.getDeliveriesDb();
    });
    setTimeout(() => {
      this.timerSubscription.unsubscribe();
    }, 1000000);
  }


  ngOnDestroy() {
      this.timerSubscription.unsubscribe();
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

    onValidateRejectionMessage(order) {
      if (confirm('Souhaitez-vous réellement refusé cette commande ?')) {
          const dataOrder: any = {
              order_id: order.order_id,
              order_accepted_by_merchant: false,
              business_id: order.businessId,
              status: 0,
              rejection_message: 'Nous vous prions de nous excuser. Cette commande ne peut être aboutie.',
          };
          this.restaurantService.refuseOrder(dataOrder).subscribe(_ => {
              this.snackBar.open(`Cette commande #${order.order_id} a bien été Refusé`, 'ok');
          });
      }
    }
}
