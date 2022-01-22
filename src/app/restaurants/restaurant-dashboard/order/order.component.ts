import { Component, OnInit } from '@angular/core';
import {RestaurantDashboardService} from '@app/restaurants/restaurant-dashboard/services/restaurant-dashboard.service';
import {RestaurantDashboardComponent} from '@app/restaurants/restaurant-dashboard/restaurant-dashboard.component';
import {ActivatedRoute, Router} from "@angular/router";
import {SecurityRestaurantService} from "@app/_services/security-restaurant.service";
import {Restaurant} from "@app/_models/restaurant";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderModalComponent } from '@app/restaurants/order-modal/order-modal.component';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  restaurantDatas: any;
  restaurant: Restaurant;
  orders: any[];
  constructor(
    private restaurantService: RestaurantDashboardService,
    private orderModal: NgbModal,
    private securityRestaurantService: SecurityRestaurantService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.securityRestaurantService.getRestaurant()
      .subscribe((res) => {
        this.restaurantService.getOrdersDatas(res.id)
          .subscribe((response) => {
            this.orders = [];
            response.forEach((elem) => {
              if (elem.order) {
                this.orders = [...this.orders, elem.order];
              }
            });
          });
      });
    /*this.restaurantService.getOrdersDatas(restaurantId).subscribe((res) => {
      this.restaurant = RestaurantDashboardComponent.extractRestaurantData('business', res);
      this.orders = RestaurantDashboardComponent.extractRestaurantData('order', res);
    });*/
  }

  onShowOrder(orderSelected: any) {
    orderSelected.isClicked = true;
    this.restaurantService.getOrderById(+orderSelected.id).subscribe( order => {
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
