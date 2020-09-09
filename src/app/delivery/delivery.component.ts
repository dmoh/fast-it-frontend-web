import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss']
})
export class DeliveryComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    if(navigator.geolocation) {
      // L'API est disponible
    } else {
      // Pas de support, proposer une alternative ?
    }
  }

}
