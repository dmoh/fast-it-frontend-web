import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "@app/_services/authentication.service";
import {RestaurantDashboardService} from "@app/restaurants/restaurant-dashboard/services/restaurant-dashboard.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderModalComponent } from '../order-modal/order-modal.component';
import { CardComponent } from '@app/home/home-features/card/card.component';
import { Observable, Subscription } from 'rxjs';
import jwtDecode from 'jwt-decode';
import {InfoModalComponent} from "@app/info-modal/info-modal.component";

@Component({
  selector: 'app-show-order',
  templateUrl: './show-order.component.html',
  styleUrls: ['./show-order.component.scss']
})
export class ShowOrderComponent implements OnInit {

  supplementsProduct: any[];
  products: any[];
  orderId: number = 0;
  businessId: number = 0;
  token: string;

  constructor(
    private activedRoute: ActivatedRoute,
    private restaurantDashboardService: RestaurantDashboardService,
    private orderModal: NgbModal,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.supplementsProduct = new Array<any>();
    this.products =  new Array<any>();
    this.token =  this.activedRoute.snapshot.params.token;
    this.orderId =  this.activedRoute.snapshot.params.orderId;
      if (this.token && this.orderId) {
          // recup mail
          this.restaurantDashboardService.checkToken(this.token, +(this.orderId))
            .subscribe((response) => {
              if (response.ok) {
                localStorage.setItem('currentUser', '{ "token":"' + decodeURI(this.token) + '"}');
                this.orderId = (this.orderId) ? +this.orderId : this.orderId;
                this.onShowModal();
              } else if (response.error)  {
                const modalRef = this.orderModal.open(InfoModalComponent, {
                  backdrop: 'static',
                  keyboard: false,
                });
                modalRef.componentInstance.title = 'Information';
                modalRef.componentInstance.message = response.error;
                modalRef.result.then((close) => {
                  this.router.navigate(['home']);
                });
              } else {
                this.router.navigate(['home']);
              }
            });
        } else {
          this.router.navigate(['home']);
        }

  }

  onShowModal() {
    this.restaurantDashboardService.getOrderById(+this.orderId).subscribe( order => {
      // test si l'id de la commande est identique au commercant actuel
      const modalRef = this.orderModal.open(OrderModalComponent, {
        backdrop: 'static',
        keyboard: false,
        size: 'lg',
      });
      modalRef.componentInstance.business = order.business;
      modalRef.componentInstance.products = order.products;
      modalRef.componentInstance.order = order;
      // modalRef.componentInstance.supplementsProduct = this.supplementsProduct;
      modalRef.result.then((res) => {
        if (res) {
          this.router.navigate(['home']);
        }
      });
      // TODO get url value commentaire order
    });
  }

}
