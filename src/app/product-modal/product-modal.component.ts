import {Component, Input, OnInit} from '@angular/core';
import {Product} from "../models/product";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {CartService} from "../cart/service/cart.service";
import {Cart} from "../cart/model/cart";

@Component({
  selector: 'app-product-modal',
  templateUrl: './product-modal.component.html',
  styleUrls: ['./product-modal.component.scss']
})
export class ProductModalComponent implements OnInit {

  quantityCurrent: number;
  cartCurrent: Cart;
  infos: string;
  @Input() product: Product;
  constructor(private modalActive: NgbActiveModal,
              private cartService: CartService
              ) { }

  ngOnInit(): void {
    this.cartService.cartUpdated.subscribe((cartUp: Cart) => {
        this.cartCurrent = cartUp;
        const index = this.cartCurrent.products.findIndex(prod => prod.id === this.product.id);
        if(index !== -1) {
            this.quantityCurrent = +this.cartCurrent.products[index].quantity;
        }else  {
            this.quantityCurrent = 1;
        }
    });

  }

 updateQuantity(type: string): void {
    if(type === 'less'){
        if(this.quantityCurrent > 1){
            this.quantityCurrent--;
           // this.product.price -= this.product.price;
        }
    } else {
      if(this.product.remainingQuantity > this.quantityCurrent){
          this.quantityCurrent++;
           // this.product.price += this.product.price;
      }else {
          this.infos = ''
      }
    }
 }


 updateCart(): void {
      this.product.quantity = this.quantityCurrent;
      this.product.remainingQuantity -= this.quantityCurrent;
      this.cartService.UpdateCart('add', this.product);
      this.modalActive.close(this.product);
 }


}
