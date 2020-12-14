import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Deliverer} from '@app/_models/deliverer';
import { Order } from '@app/_models/order';
import { Restaurant } from '@app/_models/restaurant';
import { AuthenticationService } from '@app/_services/authentication.service';
import { DeliveryService } from '../services/delivery.service';
import * as fasteatconst from "@app/_util/fasteat-constants";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InfoModalComponent } from '@app/info-modal/info-modal.component';

@Component({
  selector: 'app-awaiting-delivery',
  templateUrl: './awaiting-delivery.component.html',
  styleUrls: ['./awaiting-delivery.component.scss']
})
export class AwaitingDeliveryComponent implements OnInit {

  uploadResponse = { status: '', message: '', filePath: '' };
  schedulePrepartionTimes: any[] = [];
  commerce: Restaurant;
  deliverer: Deliverer;
  orders: any[];
  order: Order;
  orderId: string;
  error: string;
  headers: any;
  fastEatConst = fasteatconst;

  constructor(private http: HttpClient,
     private authenticate: AuthenticationService,
     private deliveryService: DeliveryService,
     private orderModal: NgbModal,
     private activatedRoute: ActivatedRoute,
     private router: Router) {

  }

  ngOnInit(): void {

    this.deliverer = new Deliverer();
    this.deliverer.orders = new Array();

    if (this.activatedRoute.snapshot.paramMap.get('id') != null) {
      this.orderId = this.activatedRoute.snapshot.paramMap.get('id');
      // add method affecter livreur
      this.doAffectDeliverer(+this.orderId);
    } else {
      // get Orders awaiting delivery
      this.deliveryService.getCurrentOrders().subscribe((delivererCurrent) => {
        console.log("delivererCurrentOrder", delivererCurrent);
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
            this.saveOrderDeliverer(currentOrder.id, deliverer.id , dateTakenDeliverer, 3);
            // this.router.navigate(['/delivery/awaiting-delivery']);
          }
          else {
            const modalRef = this.orderModal.open(InfoModalComponent, {
              backdrop: 'static',
              keyboard: false,
            });
            modalRef.componentInstance.title = 'Information';
            let delivererEmail = '.';
            if (typeof this.deliverer !== 'undefined' && typeof this.deliverer.email !== 'undefined') {
              delivererEmail = ' par ' + this.deliverer.email;
            }
            modalRef.componentInstance.message = 'Cette livraison a été récupérée' + delivererEmail;
            modalRef.result.then((close) => {
              this.router.navigate(['/delivery/awaiting-delivery']);
            });
          }
        });
    });
  }


  private saveOrderDeliverer(orderId, delivererId, dateDelivery, status) {
    let dateTakenDeliverer = dateDelivery;

    let dateDelivered = '@' + Math.round(dateDelivery/1000) ;

    let orderSave: any;
    orderSave = {
      order : {
        order_id: orderId,
        deliverer_id: delivererId,
        date_taken_deliverer: null,
        // status: 3,
      }
    };
    this.deliveryService.saveOrderDeliverer(orderSave).subscribe( orderSaved => {
      this.router.navigate([`/delivery/detail-delivery/${orderId}`]);
    });
  }

  getLibelleStatus(status: string) {
    let libelleStatus = "";
    switch (status) {
      case '2':
        libelleStatus = "En attente de récuperation"
        break;
      case '3':
        libelleStatus = "En cours de livraison"
        break;
      default:
        libelleStatus;
    }
    return libelleStatus;
  }
}
