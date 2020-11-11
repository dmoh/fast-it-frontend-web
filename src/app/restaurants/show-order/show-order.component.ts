import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "@app/_services/authentication.service";
import {RestaurantDashboardService} from "@app/restaurants/restaurant-dashboard/services/restaurant-dashboard.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderModalComponent } from '../order-modal/order-modal.component';
import { CardComponent } from '@app/home/home-features/card/card.component';
import { Observable, Subscription } from 'rxjs';

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
  
  constructor(
    private activedRoute: ActivatedRoute,
    private restaurantDashboardService: RestaurantDashboardService,
    private orderModal: NgbModal,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.supplementsProduct = new Array<any>();
    this.activedRoute.queryParams.subscribe((res) => {
        if (res.p && res.c && res.orderId && res.restoId) {
          // recup mail

          this.restaurantDashboardService.checkToken(+(res.restoId), res.c)
            .subscribe(( response) => {
              if (response.ok) {
                
                localStorage.setItem('currentUser', '{ "token":"' + decodeURI(res.c) + '"}');
                this.products = decodeURI(res.p).trim().split('x')
                .filter( product => {
                    return product !== "" ;
                });

                this.businessId = (res.restoId) ? +res.restoId : this.businessId;
                this.orderId = (res.orderId) ? +res.orderId : this.orderId;
                let listSuppProduct: any[] = decodeURI(res.suppProducts).trim().split(' ');
                listSuppProduct.forEach( suppProduct => {
                  console.log("split", suppProduct.split("|"));
                  let supplement = {
                    productId : suppProduct.split("|")[0],
                    name : suppProduct.split("|")[1],
                  }
                  this.supplementsProduct.push(supplement); 
                });

                this.onShowModal();
              } else {
                this.router.navigate(['home']);
              }
            });
        } else {
          this.router.navigate(['home']);
        }
      });
  }

  onShowModal() {    
    this.restaurantDashboardService.getOrderById(+this.orderId).subscribe( order => {
      // test si l'id de la commande est identique au commercant actuel
      if (+this.businessId !== +order.business.id) {
        this.router.navigate(['home']);
      } else {

        const modalRef = this.orderModal.open(OrderModalComponent, {
          backdrop: 'static',
          keyboard: false,
          size: 'lg',
        });
        modalRef.componentInstance.business = order.business;
        modalRef.componentInstance.products = this.products;
        modalRef.componentInstance.order = order;
        // TODO get url value commentaire order
        // TODO get url value supplementProducts
        modalRef.componentInstance.supplementsProduct = this.supplementsProduct;
      }

    });
  }

}
