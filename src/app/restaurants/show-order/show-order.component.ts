import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "@app/_services/authentication.service";
import {RestaurantDashboardService} from "@app/restaurants/restaurant-dashboard/services/restaurant-dashboard.service";

@Component({
  selector: 'app-show-order',
  templateUrl: './show-order.component.html',
  styleUrls: ['./show-order.component.scss']
})
export class ShowOrderComponent implements OnInit {

  constructor(
    private activedRoute: ActivatedRoute,
    private restaurantDashboardService: RestaurantDashboardService,
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
                this.router.navigate(['restaurant-dashboard', res.restoId ], {
                  queryParams: {
                    orderId: decodeURI(res.orderId),
                    products: decodeURI(res.p),
                  }
                });
              } else {
                this.router.navigate(['home']);
              }
            });
        } else {
          this.router.navigate(['home']);
        }
      });
  }

}
