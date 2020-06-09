import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable} from "rxjs";
import {CityDatas} from "./models/city-datas";

@Injectable({
  providedIn: 'root'
})
export class CityDataService {

  private cityDataSubject = new BehaviorSubject<CityDatas>();
  cityDataCurrent: CityDatas;
  constructor() { }

  setCityData(cityData: CityDatas) {
    console.log(cityData);
    this.cityDataCurrent = cityData;
    this.cityDataSubject.next(cityData);
  }

  getCityData(): Observable<CityDatas> {
    return this.cityDataSubject.asObservable();
  }

}
