import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthenticationService} from "@app/_services/authentication.service";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  headers: any;
  urlApi: string = environment.apiUrl;
  constructor(private http: HttpClient,  private authenticate: AuthenticationService) {
    this.headers = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
    if (this.authenticate.tokenUserCurrent) {
      this.headers.append(`Authorization: Bearer ${this.authenticate.tokenUserCurrent}`) ;
    }
  }

  registerUser(userNew: string): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/add/user`,{user: userNew}, this.headers);
  }

  passwordForgot(userNew: string): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/user/password`,{ user: userNew}, this.headers);
  }

  savePhoneNumber(phone: string): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/user/phone/save`,{ phoneUser: phone}, this.headers);
  }


  getUserAddresses(): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/user/address`, this.headers);
  }

  getRestaurantIdByUsername(username: string): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/user/restaurant`, {email: username},this.headers);
  }

  getUserTokenAliasPayment(): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/user/alias/token-payment`, this.headers);
  }

  updateUserTokenAliasPayment(tokenReceived: string): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/user/alias/update/token-payment`,{
      token: tokenReceived
    }, this.headers);
  }


  checkPromotionalCode({promotinalCode, restaurantId, sectorId}): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/user/check/code`,{
      code: promotinalCode,
      businessId: restaurantId,
      sectorId: sectorId
    }, this.headers);
  }
}
