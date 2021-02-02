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
import { Test } from 'tslint';

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
  orders: any[] = [];
  order: Order;
  orderId: string;
  error: string;
  headers: any;
  fastEatConst = fasteatconst;

  userNameNoLimit = "fasteat74@gmail.com";
  nbDeliveryMax = 2;

  constructor(private http: HttpClient,
     private authenticate: AuthenticationService,
     private deliveryService: DeliveryService,
     private orderModal: NgbModal,
     private activatedRoute: ActivatedRoute,
     private router: Router) {

  }

  ngOnInit(): void {

    this.deliverer = new Deliverer();
    this.deliverer.orders = [];

    this.deliveryService.getCurrentOrders().subscribe((delivererCurrent) => {
      if (this.activatedRoute.snapshot.paramMap.get('id') != null ) {
        // console.log("Orders count", delivererCurrent?.orders?.find(order => order?.date_taken_deliverer != null) );
        // TODO: 10.01.2021 Ajouter 2 constantes ( Mail livreur admin && Nb de courses possible )
        const canAffectDeliverer = delivererCurrent?.email === this.userNameNoLimit ||
        // delivererCurrent?.orders?.find(order => order?.date_taken_deliverer != null).length < 3;
        delivererCurrent?.orders?.length < this.nbDeliveryMax;

        this.orderId = this.activatedRoute.snapshot.paramMap.get('id');
        if (canAffectDeliverer) {
          // add method affecter livreur
          this.doAffectDeliverer(+this.orderId);
        } else {
          this.showModalInfo('Information', `${this.nbDeliveryMax} Livraisons maximum !`);
        }
      } else {
        // get Orders awaiting delivery
          this.deliverer = delivererCurrent;
          this.orders = (this.deliverer.orders != null) ? this.deliverer.orders : new Array();
        }
    });
  }


  private showModalInfo(title: string, message: string) {
    const modalRef = this.orderModal.open(InfoModalComponent, {
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.result.then((close) => {
      this.router.navigate(['/delivery/awaiting-delivery']);
    });
  }

  // Affecter un livreur  à une commande
  private doAffectDeliverer(orderId: number) {
    this.deliveryService.getOrderById(orderId).subscribe( currentOrder => {
      this.order = currentOrder;
      // console.log("currentOrder", currentOrder);
        this.deliveryService.getDeliverer().subscribe( (deliverer) => {
          console.log("deliverer", deliverer);

          if ( currentOrder.deliverer == null && deliverer.id ) {
            const dateTakenDeliverer = Date.now();
            this.saveOrderDeliverer(currentOrder.id, deliverer.id , dateTakenDeliverer, 3);
          }
          else {
            let delivererEmail = '.';
            if (typeof this.deliverer !== 'undefined' && typeof this.deliverer.email !== 'undefined') {
              delivererEmail = ' par ' + this.deliverer.email;
            }
            delivererEmail = 'Cette livraison a été récupérée' + delivererEmail;
            this.showModalInfo('Information', delivererEmail);
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
