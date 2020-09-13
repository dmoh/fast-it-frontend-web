import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthenticationService} from "@app/_services/authentication.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  headers: any;
  urlApi: string = 'http://localhost:8000/';
  constructor(private http: HttpClient,  private authenticate: AuthenticationService) {
    this.headers = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
    if (this.authenticate.tokenUserCurrent) {
      this.headers.append(`Authorization: Bearer ${this.authenticate.tokenUserCurrent}`) ;
    }
  }


  getUserAddresses(): Observable<any> {
    return this.http.get<any>(`${this.urlApi}user/address`, this.headers);
  }
}
