import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthenticationService} from '@app/_services/authentication.service';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {order} from "@app/_util/fasteat-constants";

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  headers: any;
  urlApi: string = environment.apiUrl;

  constructor(private http: HttpClient, private authenticate: AuthenticationService, private router: Router) {
    this.headers = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
    if (this.authenticate.tokenUserCurrent == null) {
      // this.router.navigate(['/login']);
    }
    if (this.authenticate.tokenUserCurrent) {
      this.headers.append(`Authorization: Bearer ${this.authenticate.tokenUserCurrent}`) ;
    }
  }

  getRestaurantList(): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/business/list`,
      this.headers);
  }


  changeCommerceState(restaurantId: number, state: boolean): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/business/${restaurantId}/change/state`,{
      restaurantIdCurrent: restaurantId, isClosed: state },
      this.headers);
  }


  getDelivererList(): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/deliverer/list`,
      this.headers);
  }
  postDelivererList(period: string, periodEnd?: string): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/deliverer/period/list`,
      {
        periodBegin: period,
      },
      this.headers);
  }

  getDeliveries(): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/order/delivery/resume`,
      this.headers);
  }


  updateDeliveries(orderIdMax: number): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/order/${orderIdMax}/deliveries/after`,
      this.headers);
  }

  assignDelivery(deliverer: number, orderAssigned: any): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/deliverer/assign/order`,
      {
        delivererId: deliverer,
        orderDelivery: orderAssigned,
      },
      this.headers);
  }


  activateCommerce(restaurantId: number, state: boolean): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/business/${restaurantId}/activate`,
      {
        restaurantIdCurrent: restaurantId, isActivate: state },
      this.headers);
  }

  updatePositionCommerce(arrOfPosition: any[]): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/business/position/update`,
      {
        restaurants: arrOfPosition },
      this.headers);
  }


  getAlertMessage(): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/alert/message/all`,
      this.headers);
  }

  findUserByEmail(emailCurrent): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/user/email`,
      { email: emailCurrent },
      this.headers);
  }

  updateRoleUser(dataUser: any): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/user/role/update`,
      { user: dataUser },
      this.headers);
  }
}
