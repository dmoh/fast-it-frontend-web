import { Injectable } from '@angular/core';
import {environment} from '@environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthenticationService} from '@app/_services/authentication.service';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {order} from "@app/_util/fasteat-constants";
import {CategoryBusiness} from "@app/_models/category-business";
import {Sector} from "@app/_models/sector";
import {Promotion} from "@app/_models/promotion";

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


  getCategoryList(): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/category/list`,
      this.headers);
  }

  getCategoryListActive(): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/category/active/list`,
      this.headers);
  }
  updateCategoryCurrent(categoryCurrent: CategoryBusiness): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/category/update`,
      { category: categoryCurrent },
      this.headers);
  }

  getBusinessByCategoryId(categoryId: number): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/category/business/${categoryId}`,
      this.headers);
  }

  getBusinessByName(name: string): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/business/find/name`,
      {
        restaurantName: name },
      this.headers);
  }

  addRestoToCategory(restoId: number, categoryId: number): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/category/resto/add`,
      { addRestoId: restoId, catId: categoryId },
      this.headers);
  }
  removeRestoToCategoryId(restoId: number, categoryId: number): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/category/resto/remove`,
      { deleteRestoId: restoId, catId: categoryId },
      this.headers);
  }


  getSectorList(): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/sector/list`,
      this.headers);
  }

  getSector(id: number): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/sector/${id}`,
      this.headers);
  }

  updateSector(sectorCurrent: Sector): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/sector/update`,
      {
        sector: sectorCurrent
      },
      this.headers);
  }

  findByNameCurrent(nameCurrent: string, typeCurrent: string): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/sector/find/name`,
      {
        type: typeCurrent,
        name: nameCurrent
      },
      this.headers);
  }


  updateElementSector(sectorId: number, idCurrent: number, typeCurrent: string): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/sector/${sectorId}/update/element`,
      {
        type: typeCurrent,
        id: idCurrent
      },
      this.headers);
  }

  deleteElementSector(sectorId: number, idCurrent: number, typeCurrent: string): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/sector/${sectorId}/delete/element`,
      {
        type: typeCurrent,
        id: idCurrent
      },
      this.headers);
  }

  getPromotions(): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/promotion/list`,
        this.headers);
  }


  archivePromotion(promotionId: number): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/promotion/archive/${promotionId}`,
        this.headers);
  }

  updatePromotion(promotion: Promotion): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/promotion/update`,
        {
          promotion: promotion
        },
        this.headers);
  }
}
