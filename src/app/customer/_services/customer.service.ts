import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthenticationService} from "@app/_services/authentication.service";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  headers: any;
  urlApi: string = environment.apiUrl;

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

  getInfosCustomer(): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/customer/show`,
      this.headers);
  }

  getOrdersCustomer(): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/customer/order/list`,
      this.headers);
  }

  getNotificationsCustomer(): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/notification/list`,
      this.headers);
  }

  getNotificationsCustomerUnread(): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/notification/list/unread`,
      this.headers);
  }

  getCommentCustomer(id: number): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/opinion/customer/${id}/list`,
      this.headers);
  }

  sendNotificationsRead(notifications: any[], entity): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/notification/read`, { notif: JSON.stringify(notifications), entity: entity },
      this.headers);
  }


  editCustomer(fd: FormData): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/user/edit`, fd,
      this.headers);
  }

  addNewAddress(address: string) {
    return this.http.post<any>(`${this.urlApi}/user/add/address`, { newAddress:
      address },
      this.headers);
  }
}

