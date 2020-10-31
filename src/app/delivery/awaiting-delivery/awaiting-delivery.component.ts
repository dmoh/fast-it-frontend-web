import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestaurantDashboardComponent } from '@app/restaurants/restaurant-dashboard/restaurant-dashboard.component';
import { Delivery } from '@app/_models/delivery';
import { Order } from '@app/_models/order';
import { Restaurant } from '@app/_models/restaurant';
import { AuthenticationService } from '@app/_services/authentication.service';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
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
  orders: any[];
  order: Order;
  orderId: string;
  error: string;
  headers: any;

  constructor(private http: HttpClient,
     private authenticate: AuthenticationService,
     private deliveryService: DeliveryService,
     private route: ActivatedRoute,
     private router: Router) {
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
    
    if (this.route.snapshot.paramMap.get('id') != null) {
      this.orderId = this.route.snapshot.paramMap.get('id');
      this.deliveryService.getOrderById(+this.orderId).subscribe( currentOrder => {
        this.order = currentOrder;
          
        // affecter un chauffeur à une commande
        if (currentOrder.deliverer.id == null) {
          let orderDeliverer: any;
          let dateTakenDeliverer = Date.now();
          orderDeliverer = { 
            order : {
              order_id: currentOrder.id,
              deliverer_id: this.orderId,
              date_taken_deliverer: dateTakenDeliverer,
            }
          };
          this.deliveryService.saveOrderDeliverer(orderDeliverer).subscribe();
        }
        this.router.navigate(['/delivery/awaiting-delivery']);
      });
    }

    this.deliveryService.getCurrentOrders().subscribe((delivererCurrent)=>{
      this.delivery = delivererCurrent[0]; 
      this.orders = new Array();
      if (this.delivery.orders != null) {
        this.delivery.orders.forEach( order => {
          this.deliveryService.getOrderById(order.id).subscribe( orderById=> {
            // let order: Order = new Order();
          this.orders.push(orderById);
          console.log('array', this.orders); 
          });
        });
      }


    })
  }


  // setNotif() {
  //   this.deliveryService.sendNotificationsDeliverer().subscribe();
  // }

  saveOrderDeliverer() {
    let order: any;
    let dateDelivered = Date.now();
    order = { 
      order : {
        order_id: this.orderId,
        deliverer_id: this.delivery.id,
        date_delivered: dateDelivered,
      }
    };
    this.deliveryService.sendDelivererCode(order).subscribe();
  }

}
