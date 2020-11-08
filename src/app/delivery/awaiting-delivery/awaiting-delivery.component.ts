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
  schedulePrepartionTimes: any[] = [];
  commerce: Restaurant;
  deliverer: Delivery;
  orders: any[];
  order: Order;
  orderId: string;
  error: string;
  headers: any;

  constructor(private http: HttpClient,
     private authenticate: AuthenticationService,
     private deliveryService: DeliveryService,
     private activatedRoute: ActivatedRoute,
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

    this.deliverer = new Delivery();
    this.deliverer.orders = new Array();
    
    if (this.activatedRoute.snapshot.paramMap.get('id') != null) {
      this.orderId = this.activatedRoute.snapshot.paramMap.get('id');
      this.deliveryService.getOrderById(+this.orderId).subscribe( currentOrder => {
        this.order = currentOrder;
        console.log("currentOrder", currentOrder);
        let request = {};
          this.deliveryService.getUserInfo(request).subscribe( (userResponse) => {
            this.deliverer = userResponse;
            console.log("userResponse", userResponse);
            // Affecter un chauffeur à une commande
            if (currentOrder.deliverer == null && this.deliverer.id) {
              let orderDeliverer: any;
              let dateTakenDeliverer = Date.now();
              orderDeliverer = { 
                order : {
                  order_id: currentOrder.id,
                  deliverer_id: this.deliverer.id,
                  date_taken_deliverer: dateTakenDeliverer,
                }
              };
              console.log("orderDeliverer", orderDeliverer);
              this.deliveryService.saveOrderDeliverer(orderDeliverer).subscribe();
            }
            this.router.navigate(['/delivery/awaiting-delivery']);
          });
      });
    } else {
      this.deliveryService.getCurrentOrders().subscribe((delivererCurrent)=>{
        console.log("delivererCurrent", delivererCurrent);
        this.deliverer = delivererCurrent[0]; 
        this.orders = new Array();

        if (this.deliverer != null) {
          this.deliverer.orders = (delivererCurrent[0].orders_deliverer) ? delivererCurrent[0].orders_deliverer : null;
          if (this.deliverer.orders != null) {
            this.deliverer.orders.forEach( order => {
              this.deliveryService.getOrderById(order.id).subscribe( orderById=> {
              console.log("orderById", orderById);
                // let order: Order = new Order();
              this.orders.push(orderById);
              });
            });
          } 
        } 
      });
    }
  }

  saveOrderDeliverer() {
    let order: any;
    let dateDelivered = Date.now();
    order = { 
      order : {
        order_id: this.orderId,
        deliverer_id: this.deliverer.id,
        date_delivered: dateDelivered,
      }
    };
    this.deliveryService.saveOrderDeliverer(order).subscribe();
  }

}
