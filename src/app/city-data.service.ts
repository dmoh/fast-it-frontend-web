import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable} from "rxjs";
import {CityDatas} from "./models/city-datas";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthenticationService} from "@app/_services/authentication.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class CityDataService {

  private cityDataSubject = new BehaviorSubject<any>({});
  cityDataCurrent: any;
  headers: any;
  urlApi: string = 'http://localhost:8000/';

  constructor(private http: HttpClient, private authenticate: AuthenticationService, private router: Router) {
    this.headers = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
  }

  setCityData(cityData: any) {
    console.log(cityData);
    this.cityDataCurrent = cityData;
    this.cityDataSubject.next(cityData);
    //store on storage
    localStorage.setItem('cityData', JSON.stringify(this.cityDataCurrent));
  }

  getCityData(): Observable<CityDatas> {
    return this.cityDataSubject.asObservable();
  }

  getRestaurants(area: any): Observable<any> {
    return this.http.post<any>(`${this.urlApi}businesses/area`, area,
      this.headers);
  }

}
