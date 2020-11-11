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
      // add method affecter livreur
      this.doAffectDeliverer(+this.orderId);
    } else {
      // get Orders awaiting delivery
      this.deliveryService.getCurrentOrders().subscribe((delivererCurrent)=>{
        console.log("delivererCurrent", delivererCurrent);
        this.deliverer = delivererCurrent; 
        this.orders = (this.deliverer.orders != null) ? this.deliverer.orders : new Array();
      });
    }
  }


  // Affecter un livreur  à une commande
  private doAffectDeliverer(orderId: number) {
    this.deliveryService.getOrderById(orderId).subscribe( currentOrder => {
      this.order = currentOrder;
      // console.log("currentOrder", currentOrder);
        this.deliveryService.getDeliverer().subscribe( (deliverer) => {
          // console.log("deliverer", deliverer);
          if (currentOrder.deliverer == null && deliverer.id) {
            let dateTakenDeliverer = Date.now();
            this.saveOrderDeliverer(currentOrder.id, deliverer.id , dateTakenDeliverer);
          }
          // retourne sur la page sans get param
          this.router.navigate(['/delivery/awaiting-delivery']);
        });
    });
  }

  
  private saveOrderDeliverer(orderId, delivererId, dateDelivery) {
    let dateTakenDeliverer = dateDelivery;

    let dateDelivered = '@' + Math.round(dateDelivery/1000) ;
    
    let orderSave: any;
    orderSave = { 
      order : {
        order_id: orderId,
        deliverer_id: delivererId,
        date_taken_deliverer: dateTakenDeliverer,
        status: 3,
      }
    };
    this.deliveryService.saveOrderDeliverer(orderSave).subscribe();
  }
}
