import { Component, OnInit } from '@angular/core';
import {User} from '@app/_models/user';
import {CustomerService} from '@app/customer/_services/customer.service';
import * as fasteatconst from '@app/_util/fasteat-constants';
import {Order} from '@app/_models/order';
import {RestaurantDashboardService} from '@app/restaurants/restaurant-dashboard/services/restaurant-dashboard.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {OrderModalComponent} from '@app/customer/order/order-modal/order-modal.component';
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  customer: User = new User();
  fastEatConst = fasteatconst;
  constructor(
    private customerService: CustomerService,
    private orderModal: NgbModal,
    private restaurantDashboardService: RestaurantDashboardService,

  ) { }

  ngOnInit(): void {
    this.customerService.getOrdersCustomer()
      .subscribe((response) => {
        this.customer.orders = response;
      });
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
