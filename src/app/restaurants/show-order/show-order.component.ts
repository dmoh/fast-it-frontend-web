import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "@app/_services/authentication.service";
import {RestaurantDashboardService} from "@app/restaurants/restaurant-dashboard/services/restaurant-dashboard.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderModalComponent } from '../order-modal/order-modal.component';
import { CardComponent } from '@app/home/home-features/card/card.component';

@Component({
  selector: 'app-show-order',
  templateUrl: './show-order.component.html',
  styleUrls: ['./show-order.component.scss']
})
export class ShowOrderComponent implements OnInit {

  products: any[];
  
  constructor(
    private activedRoute: ActivatedRoute,
    private restaurantDashboardService: RestaurantDashboardService,
    private orderModal: NgbModal,
    private router: Router
  ) {

  }

  ngOnInit(): void {
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

                // this.products = this.products.map( product => {
                //   product = "x" + product;
                // });

                console.log(this.products);
                // this.router.navigate(['restaurant-dashboard', res.restoId ], {
                //   queryParams: {
                //     orderId: decodeURI(res.orderId),
                //     products: decodeURI(res.p),
                //   }
                // });
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
    const modalRef = this.orderModal.open(OrderModalComponent, {
      backdrop: 'static',
      keyboard: true,
      size: 'lg',
     });

     modalRef.componentInstance.products = this.products;
  }

}
