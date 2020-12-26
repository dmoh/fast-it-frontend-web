import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {CartService} from '@app/cart/service/cart.service';
import {Cart} from '@app/cart/model/cart';

@Component({
  selector: 'app-tip-modal',
  templateUrl: './tip-modal.component.html',
  styleUrls: ['./tip-modal.component.scss']
})
export class TipModalComponent implements OnInit {

  cart: Cart;
  @Input() tipAmount: number;
  constructor(public modalActive: NgbActiveModal,
              private cartService: CartService
  ) { }

  ngOnInit(): void {
    if (typeof this.tipAmount === 'undefined') {
      this.tipAmount = 0.50;
    }
  }

  updateQuantity(type: string): void {
    if (type === 'less') {
      if (this.tipAmount > 0.50) {
        this.tipAmount--;
      } else {
        this.tipAmount = 0;
      }
    } else {
      this.tipAmount += 0.5;
    }
  }


  onValidate() {
      this.cartService.setTipDelivererAmount(this.tipAmount);
      this.modalActive.close();
  }

  onRefuse() {
    this.cartService.setTipDelivererAmount(0);
    this.modalActive.close();
  }
}
