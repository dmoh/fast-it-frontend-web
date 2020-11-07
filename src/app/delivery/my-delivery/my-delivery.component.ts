import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {RestaurantDashboardComponent} from '@app/restaurants/restaurant-dashboard/restaurant-dashboard.component';
import {RestaurantDashboardService} from '@app/restaurants/restaurant-dashboard/services/restaurant-dashboard.service';
import {Restaurant} from "@app/_models/restaurant";
import {Delivery} from "@app/_models/delivery";
import {UploadService} from "@app/_services/upload.service";
import { Observable } from 'rxjs';
import { AuthenticationService } from '@app/_services/authentication.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { DeliveryService } from '../services/delivery.service';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-my-delivery',
  templateUrl: './my-delivery.component.html',
  styleUrls: ['./my-delivery.component.scss']
})

export class MyDeliveryComponent implements OnInit, AfterViewInit {
  uploadResponse = { status: '', message: '', filePath: '' };
  schedulePrepartionTimes: any[] = [];
  commerce: Restaurant;
  deliverer: Delivery;
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
    this.deliverer = new Delivery();
    this.deliveryService.getInfosDeliverer().subscribe((response) => {
      this.deliverer = response[0];
      console.log(this.deliverer.orders);
      this.deliverer.orders.forEach( order => {
        this.deliveryService.getOrderById(+order.id).subscribe( currentOrder => {            
          order.business = currentOrder.business;
          console.log("order", order);
        }) 
      });   
    });
  }

  ngAfterViewInit() {

  }



}
