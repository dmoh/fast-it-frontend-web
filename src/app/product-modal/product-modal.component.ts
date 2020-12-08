import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Product} from '../models/product';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {CartService} from '../cart/service/cart.service';
import {Cart} from '../cart/model/cart';
import {ProductService} from "@app/_services/product.service";
import {ListSupplements} from "@app/_models/list-supplements";
import {Supplement} from "@app/_models/supplement";
import {FormControl} from "@angular/forms";
import {MatSelectionListChange} from "@angular/material/list";
import {MatRadioChange} from "@angular/material/radio";

@Component({
  selector: 'app-product-modal',
  templateUrl: './product-modal.component.html',
  styleUrls: ['./product-modal.component.scss']
})
export class ProductModalComponent implements OnInit {

  quantityCurrent: number;
  cartCurrent: Cart;
  infos: string;
  lists: ListSupplements[] = [];
  supplementProducts: Supplement[] = [];
  listSelected: ListSupplements;
  supplementsSelected = new FormControl();
  listRequired: ListSupplements[] = [];
  hasListRequired: boolean;
  showSpinner;
  @ViewChild('listSup') listSup;
  @Input() product: Product;
  @Input() restaurant: any;
  constructor(public modalActive: NgbActiveModal,
              private cartService: CartService,
              private productService: ProductService
              ) {

  }

  ngOnInit(): void {
    this.product = Object.assign({}, this.product);
    if (typeof  this.product.hasListOrSupplement !== 'undefined'
      &&
      this.product.hasListOrSupplement === true) {
      this.showSpinner = true;
    }
    if (typeof this.product.hasListOrSupplement !== 'undefined' && this.product.hasListOrSupplement === true) {
      this.productService.getListSupplementByProductId(this.product.id)
        .subscribe((response) => {
          this.showSpinner = false;
          if (response.lists) {
            this.lists = response.lists;
            if (this.lists.length > 0) {
              this.listRequired = this.lists.filter((elem) => {
                this.hasListRequired = true;
                return elem.isRequired === true;
              });
            }
          }
          if (response.supplementProducts) {
             // this.product.supplementProducts = response.supplementProducts;
            this.supplementProducts = response.supplementProducts;
          }
        });
    }

    this.cartService.cartUpdated.subscribe((cartUp: Cart) => {
        this.cartCurrent = cartUp;
        const index = this.cartCurrent.products.findIndex(prod => prod.id === this.product.id);
        if (index !== -1) {
            this.quantityCurrent = +this.cartCurrent.products[index].quantity;
            this.product = this.cartCurrent.products[index];
        } else {
            this.quantityCurrent = 1;
        }
    });

  }

 updateQuantity(type: string): void {
    if (type === 'less') {
        if (this.quantityCurrent > 1) {
            this.quantityCurrent--;
        }
    } else {
        this.quantityCurrent++;
    }
 }


 updateCart(): void {
      this.product.quantity = this.quantityCurrent;
      this.product.remaining_quantity -= this.quantityCurrent;
      this.product = Object.assign({}, this.product);
      this.cartService.UpdateCart('add', this.product, this.restaurant );
      this.modalActive.close(this.product);
 }

 onChange(event: MatSelectionListChange, list: ListSupplements) {
   this.productListSupplement(event.option.value, list);
 }


 onRadioChange(event: MatRadioChange, list: ListSupplements) {
    this.productListSupplement(event.value, list);
 }
 onChangeSupplement(event: MatSelectionListChange): void {
   const supplementSelected = event.option.value;
   if (event.option.selected) {
      if (supplementSelected.amount !== null && +(supplementSelected.amount) > 0) {
        this.product.amount += supplementSelected.amount;
      }
      if (typeof this.product.supplementProducts === 'undefined' || this.product.supplementProducts.length === 0) {
        this.product.supplementProducts = [event.option.value];
      }
      const index = this.product.supplementProducts.findIndex((elem) => elem.id = supplementSelected.id);
      if (index === -1) {
        this.product.supplementProducts = [...this.supplementProducts, supplementSelected];
      }
    } else {
     this.product.supplementProducts = this.product.supplementProducts.filter((elem) => elem.id !== supplementSelected.id);
     if (supplementSelected.amount !== null && +(supplementSelected.amount) > 0) {
       this.product.amount -= supplementSelected.amount;
     }
   }
 }

 private productListSupplement(sup: Supplement, list: ListSupplements):void {
   if (typeof this.product.listSupplements === 'undefined') {
     this.product.listSupplements = [];
   }

   const listAlreadyExists = this.product.listSupplements.findIndex(elem =>
     elem.id === list.id);
   this.listSelected = Object.assign({}, list);
   if (listAlreadyExists === -1) {
     this.listSelected.supplementProducts = [sup];
     this.product.listSupplements = [...this.product.listSupplements, this.listSelected];
   } else {
     this.product.listSupplements[listAlreadyExists].supplementProducts = [sup];
   }
   this.listRequired = this.listRequired.filter((elem) => {
     return elem.id !== this.listSelected.id;
   });
   if (this.listRequired.length === 0 && this.hasListRequired === true) {
     this.hasListRequired = !this.hasListRequired;
   }
 }


}
