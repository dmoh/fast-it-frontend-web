import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthenticationService} from "@app/_services/authentication.service";
import {Router} from "@angular/router";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
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

  getOrdersDatas(restaurantId: number): Observable<any> {
    return this.http.get<any>(`${this.urlApi}business/orders/${restaurantId}`,
      this.headers);
  }

  getCurrentOrders(): Observable<any> {
    return this.http.get<any>(`${this.urlApi}deliverer/current_orders`,
      this.headers);
  }

  getInfosDeliverer(): Observable<any> {
    return this.http.get<any>(`${this.urlApi}deliverer/show`,
      this.headers);
  }

  getKbis(noKbis: string): Observable<any> {
    return this.http.get<any>(`https://entreprise.data.gouv.fr/api/sirene/v1/siret/` + noKbis);
      this.headers;
  }

  getNotificationsDelivery(): Observable<any> {
    return this.http.get<any>(`${this.urlApi}notification/list`,
      this.headers);
  }

  sendNotificationsRead(notifications: any[], entity): Observable<any> {
    return this.http.post<any>(`${this.urlApi}notification/read`, { notif: JSON.stringify(notifications), entity: entity },
      this.headers);
  }

  sendNotificationsDeliverer(): Observable<any> {
    return this.http.post<any>(`${this.urlApi}deliverer/notif`, this.headers);
  }

  sendDelivererCode(request: any[]){
    console.warn(JSON.stringify(request));
    console.warn(request);
    return this.http.post<any>(`${this.urlApi}order/save/final`, request, this.headers);
  }

}
