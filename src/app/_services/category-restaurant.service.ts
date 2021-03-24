import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {CityDatas} from "@app/models/city-datas";
import {CategoryBusiness} from "@app/_models/category-business";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "@environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CategoryRestaurantService {
  headers: any;
  urlApi: string = environment.apiUrl;

  private categoryRestaurantSubject = new BehaviorSubject<CategoryBusiness>(new CategoryBusiness());
  public currentCategoryRestaurant: Observable<CategoryBusiness>;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
    this.currentCategoryRestaurant = this.categoryRestaurantSubject.asObservable();
  }

  getCategoryRestaurant(): Observable<any> {
    return this.categoryRestaurantSubject.asObservable();
  }

  setCategorySelected(category: CategoryBusiness) {
    this.categoryRestaurantSubject.next(category);
  }


  getRestaurantListAssociatedToCategory(id: number): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/category/${id}/associated/business`,
      this.headers);
  }
}
