import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthenticationService} from "@app/_services/authentication.service";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {stringify} from "querystring";

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
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

  getInfosCustomer(): Observable<any> {
    return this.http.get<any>(`${this.urlApi}customer/show`,
      this.headers);
  }

  getNotificationsCustomer(): Observable<any> {
    return this.http.get<any>(`${this.urlApi}notification/list`,
      this.headers);
  }

  sendNotificationsRead(notifications: any[], entity): Observable<any> {
    return this.http.post<any>(`${this.urlApi}notification/read`, { notif: JSON.stringify(notifications), entity: entity },
      this.headers);
  }

}

