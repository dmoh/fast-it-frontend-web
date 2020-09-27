import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestaurantDashboardComponent } from '@app/restaurants/restaurant-dashboard/restaurant-dashboard.component';
import { Delivery } from '@app/_models/delivery';
import { Order } from '@app/_models/order';
import { Restaurant } from '@app/_models/restaurant';
import { AuthenticationService } from '@app/_services/authentication.service';
import { DeliveryService } from '../services/delivery.service';

@Component({
  selector: 'app-awaiting-delivery',
  templateUrl: './awaiting-delivery.component.html',
  styleUrls: ['./awaiting-delivery.component.scss']
})
export class AwaitingDeliveryComponent implements OnInit {

  uploadResponse = { status: '', message: '', filePath: '' };
  urlApi: string = 'http://localhost:8000/';
  schedulePrepartionTimes: any[] = [];
  commerce: Restaurant;
  delivery: Delivery;
  orders: Order[];
  error: string;
  headers: any;

  constructor(private http: HttpClient, private authenticate: AuthenticationService, private deliveryService: DeliveryService, private router: Router) {
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

  ngOnInit(): void {

    this.delivery = new Delivery();
    this.delivery.orders = new Array();
    
    this.deliveryService.getCurrentOrders().subscribe((result)=>{
      this.delivery = result[0];
      console.warn('Infos livreur', this.delivery);
      console.log("Orders", this.delivery.orders);
    })
  }

  setNotif() {
    this.deliveryService.sendNotificationsDeliverer().subscribe();
  }

}
