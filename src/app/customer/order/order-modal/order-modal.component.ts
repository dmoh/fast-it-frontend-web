import {Component, Input, OnInit} from '@angular/core';
import {Product} from '@app/models/product';
import {Order} from '@app/_models/order';
import {Restaurant} from '@app/_models/restaurant';

@Component({
  selector: 'app-order-modal',
  templateUrl: './order-modal.component.html',
  styleUrls: ['./order-modal.component.scss']
})
export class OrderModalComponent implements OnInit {
  @Input() products: Product[];
  @Input() order: Order;
  @Input() business: Restaurant;
  @Input() additionalInfo: string;
  constructor() { }

  ngOnInit(): void {
  }

}
