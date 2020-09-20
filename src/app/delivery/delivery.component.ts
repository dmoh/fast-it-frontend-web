import { Component, OnInit } from '@angular/core';
import { DeliveryService } from './services/delivery.service';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss']
})
export class DeliveryComponent implements OnInit {

  orders: any;

  constructor(private deliveryService: DeliveryService) { }

  // static getData(typeData: string, arrayDeliveryDatas: any[]) {
  //   const arrRestaurant =  arrayDeliveryDatas.filter((elem) => {
  //     return elem[typeData];
  //   });
  //   switch (typeData) {
  //     case 'order':
  //       return arrRestaurant.filter(elem => {
  //         return elem[typeData];
  //       });
  //   }
  // }

  ngOnInit(): void {
    console.log('delivery service', this.deliveryService)
    // recuperer la geoloc
    if(navigator.geolocation) {
      // L'API est disponible
    } else {
      // Pas de support, proposer une alternative ?
    }

    // this.deliveryService.getOrdersDatas(1).subscribe((res) => {
    //   this.orders = DeliveryComponent.getData('order', res);
    //   console.warn(this.orders);
    // } );
  }
  
}
