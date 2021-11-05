import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from '@app/_models/user';
import {CustomerService} from '@app/customer/_services/customer.service';
import * as fasteatconst from '@app/_util/fasteat-constants';
import {Order} from '@app/_models/order';
import {RestaurantDashboardService} from '@app/restaurants/restaurant-dashboard/services/restaurant-dashboard.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {OrderModalComponent} from '@app/customer/order/order-modal/order-modal.component';
import {Subscription, timer} from "rxjs";
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit, OnDestroy {

  customer: User = new User();
  fastEatConst = fasteatconst;
  timerSubscription: Subscription;
  awaitingOrders = [];
  isFillingForTheFirstTime: boolean = false;
  constructor(
    private customerService: CustomerService,
    private orderModal: NgbModal,
    private restaurantDashboardService: RestaurantDashboardService
  ) { }

  ngOnInit(): void {
    this.customerService
        .getOrdersCustomer()
        .subscribe((response) => {
          this.customer.orders = response;
          const source = timer(4000, 7000);
          this.timerSubscription = source.subscribe(val => {
            this.customerService
                .getOrdersCustomerDay()
                .subscribe((res) => {
                    if (!this.isFillingForTheFirstTime) {
                        this.awaitingOrders = res;
                        this.isFillingForTheFirstTime = !this.isFillingForTheFirstTime;
                    }

                    if (res && res.length > 0){
                        this.customer
                            .orders
                            .forEach((order, index) => {
                              const idOrder = res.findIndex(o => +order.id === +o.id);
                                if (idOrder !== -1 && this.awaitingOrders.length > 0) {
                                this.customer.orders[index] = res[idOrder];
                              }
                            });
                        if (this.awaitingOrders.length === 0) {
                            this.unsubscribeTimer();
                        }
                          this.awaitingOrders = res.filter((ord) => {
                              if (
                                  +ord.status !== +fasteatconst.status.ORDER_CLOSED_WITH_SUCCESS
                                  && +ord.status !== +fasteatconst.status.ORDER_REFUSED
                              ) {
                                  return ord;
                              }
                          });

                      } else {
                        this.unsubscribeTimer();
                      }
                    }
                );
          });
        });
  }

  ngOnDestroy() {
    this.unsubscribeTimer();
  }

  unsubscribeTimer() {
    this.timerSubscription.unsubscribe();
  }
  onShowOrder(orderSelected: any) {
    orderSelected.isClicked = true;
    this.restaurantDashboardService.getOrderById(+orderSelected.id).subscribe( order => {
      const modalRef = this.orderModal.open(OrderModalComponent, {
        backdrop: 'static',
        keyboard: false,
        size: 'lg',
      });
      modalRef.componentInstance.business = order.business;
      modalRef.componentInstance.products = order.products;
      modalRef.componentInstance.order = order;
      modalRef.result.then(() => orderSelected.isClicked = false);
      });
  }

}
