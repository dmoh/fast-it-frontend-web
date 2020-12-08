import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthenticationService} from '@app/_services/authentication.service';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {CategoryProduct} from '@app/_models/category-product';
import {environment} from '../../../../environments/environment';
import {Restaurant} from '@app/_models/restaurant';
import {ListSupplements} from "@app/_models/list-supplements";
import {Supplement} from "@app/_models/supplement";

@Injectable({
  providedIn: 'root'
})
export class RestaurantDashboardService {
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

  getProductsByRestaurantId(restaurantId: number): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/product/list/business/${restaurantId}`,
      this.headers);
  }

  getRestaurantDatas(restaurantId: number): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/business/products/${restaurantId}`,
      this.headers);
  }
  getRestaurantProductsDatas(restaurantId: number): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/business/${restaurantId}/categories/products`,
      this.headers);
  }

  getRestaurantMedias(restaurantId: number): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/business/${restaurantId}/medias`,
      this.headers);
  }

  getOrdersDatas(restaurantId: number): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/business/orders/${restaurantId}`,
      this.headers);
  }
  getOrdersCurrentDatas(restaurantId: number): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/business/orders-current/${restaurantId}`,
      this.headers);
  }

  updateProduct(product: any): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/product/update`, product,
      this.headers);
  }

  getOpinionByBusinessId(restaurantId: number): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/opinion/business/${restaurantId}`,
      this.headers);
  }

  getScheduleByBusinessId(restaurantId: number): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/business/${restaurantId}/schedule`,
      this.headers);
  }

  getCategoriesByBusinessId(restaurantId: number): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/business/${restaurantId}/categories-product`,
      this.headers);
  }

  updateScheduleBusiness(restaurantId: number): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/product/update`, restaurantId,
      this.headers);
  }

  addCategoryToRestaurant(category: CategoryProduct): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/business/${category.business_id}/add/category`, JSON.stringify(category),
      this.headers);
  }

  checkToken(token: string, order: number): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/business/check/token/manager`, {tokenUser:  token, orderId: order},
      this.headers);
  }


  addProductToCategory(categoryId: number, product: any[]) {
      return this.http.post<any>(`${this.urlApi}/business/category/${categoryId}/add/product`, { products: JSON.stringify(product)},
      this.headers);
  }

  getProductByCategoryId(categoryId: number): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/business/category/${categoryId}/product/list`,
      this.headers);
  }


  getOrderById(orderId: number): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/order/${orderId}`,
      this.headers);
  }


  getProductListWithoutCategory(restaurantId: number): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/business/${restaurantId}/no-category/products`,
      this.headers);
  }


  getOrderAnalize(restaurantId: number): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/business/${restaurantId}/analyze`,
      this.headers);
  }

  getRestaurantInfosById(restaurantId: number): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/business/${restaurantId}/informations`, this.headers);
  }

  saveResponseMerchant(order: any): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/response-merchant`, order,
    this.headers);
  }

  acceptOrder(order: any): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/order/save_business`, order,
      this.headers);
  }

  refuseOrder(order: any): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/order/save_business`, order,
      this.headers);
  }


  getProductListByBusinessId(restaurantId: number): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/product/list/business/${restaurantId}`, this.headers);
  }

  updateCategoryProductPosition(catPosition: any[]): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/category/position/update`, JSON.stringify(catPosition),
      this.headers);
  }


  getUrlRestaurant(): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/business/url`, this.headers);
  }

  getBusinessProductById(id) {
    return this.http.get<any>(`${this.urlApi}/product/${id}`, this.headers);
  }

  getStatsByRestaurantId(restaurantId: number, periodSelected: string) {
    return this.http.post<any>(`${this.urlApi}/api/order/stats`, {id: restaurantId, period: periodSelected }, this.headers);
  }

  getSupplementByBusinessId(restaurantId: number): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/business/${restaurantId}/list/supplement`, this.headers);
  }


  getListSupplementByBusinessId(restaurantId: number): Observable<any> {
      return this.http.get<any>(`${this.urlApi}/business/${restaurantId}/get/list-supplement/for/product`, this.headers);
  }

  updateListSupplementByRestaurantId(restaurantId: number, listSupplement: ListSupplements): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/business/${restaurantId}/update/list/for/product`, { listSup: listSupplement}, this.headers);
  }

  getListSupplementByProductIdAndBusinessId(restaurantId: number, productId: number): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/business/${restaurantId}/list-supplement/product/${productId}`, this.headers);
  }

  updateListSupplementByProductIdAndBusinessId(restaurantId: number, productId: number, listSupplement: ListSupplements[]): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/business/${restaurantId}/product/${productId}/update/list-supplement`, { listSup: listSupplement}, this.headers);
  }


  updateSupplementByBusinessId(restaurantId: number, sup: Supplement): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/business/${restaurantId}/update/supplement`, { supplement: sup}, this.headers);
  }
  updateSupplementByProductIdBusinessId(restaurantId: number, productId: number, sup: Supplement[]): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/business/${restaurantId}/update/product/${productId}/supplement`, { supplements: sup}, this.headers);
  }



}
