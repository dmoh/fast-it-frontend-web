import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthenticationService} from "@app/_services/authentication.service";
import {Router} from "@angular/router";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RestaurantDashboardService {
  headers: any;
  urlApi: string = 'http://localhost:8000/';

  constructor(private http: HttpClient, private authenticate: AuthenticationService, private router: Router) {
    this.headers = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
    if (localStorage.getItem('cart_fast_eat')) {
    }
    if (this.authenticate.tokenUserCurrent == null) {
      // this.router.navigate(['/login']);
    }
    if (this.authenticate.tokenUserCurrent) {
      this.headers.append(`Authorization: Bearer ${this.authenticate.tokenUserCurrent}`) ;
    }
  }

  getProductsByRestaurantId(restaurantId: number): Observable<any> {
    return this.http.get<any>(`${this.urlApi}product/list/business/${restaurantId}`,
      this.headers);
  }

  getRestaurantDatas(restaurantId: number): Observable<any> {
    return this.http.get<any>(`${this.urlApi}business/products/${restaurantId}`,
      this.headers);
  }

  getOrdersDatas(restaurantId: number): Observable<any> {
    return this.http.get<any>(`${this.urlApi}business/orders/${restaurantId}`,
      this.headers);
  }

}
