import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "@app/_services/authentication.service";
import {RestaurantDashboardService} from "@app/restaurants/restaurant-dashboard/services/restaurant-dashboard.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderModalComponent } from '../order-modal/order-modal.component';
import { CardComponent } from '@app/home/home-features/card/card.component';
import { Observable, Subscription } from 'rxjs';
import jwtDecode from 'jwt-decode';

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
    this.products =  new Array<any>();
    this.activedRoute.queryParams.subscribe((res) => {
        if (res.p && res.c && res.orderId && res.restoId) {
          // recup mail

          this.restaurantDashboardService.checkToken(+(res.restoId), res.c)
            .subscribe(( response) => {
              if (response.ok) {
                
                localStorage.setItem('currentUser', '{ "token":"' + decodeURI(res.c) + '"}');

                if (res.p) {
                  const listProductURi = decodeURI(res.p).trim().split('x')
                  .filter( product => {
                      return product !== "" ;
                  });

                  listProductURi.forEach( product => {
                    const productBis: any = { };
                    productBis.quantity = product.split(' ')[0];
                    productBis.name = product.split(' ')[1];
                    productBis.amount = product.split(' ')[2];
                    productBis.id = product.split(' ')[3];

                    this.products.push(productBis);
                  });
                }

                this.businessId = (res.restoId) ? +res.restoId : this.businessId;
                this.orderId = (res.orderId) ? +res.orderId : this.orderId;

                // createProductList
                let listSuppProduct: any[] = decodeURI(res.suppProducts).trim().split(' ');
                listSuppProduct.forEach( suppProduct => {
                  let supplement: any = { };
                  supplement = {
                    productId : suppProduct.split("-NEXTSUP-")[0],
                    name : suppProduct.split("-NEXTSUP-")[1],
                  }
                  this.supplementsProduct.push(supplement); 
                });
                console.log("supplements produit", this.supplementsProduct);

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
        modalRef.componentInstance.supplementsProduct = this.supplementsProduct;
        // TODO get url value commentaire order
      }

    });
  }

}
