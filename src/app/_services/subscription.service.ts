import { Injectable } from '@angular/core';
import {environment} from "@environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthenticationService} from "@app/_services/authentication.service";
import {Router} from "@angular/router";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  headers: any;
  urlApi: string = environment.apiUrl;

  constructor(private http: HttpClient, private authenticate: AuthenticationService, private router: Router) {
    this.headers = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
    if (this.authenticate.tokenUserCurrent) {
      this.headers.append(`Authorization: Bearer ${this.authenticate.tokenUserCurrent}`) ;
    }
  }


  updateSubscription(sub: any): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/api/subscription/update`,{subscription: sub }, this.headers);
  }
}
