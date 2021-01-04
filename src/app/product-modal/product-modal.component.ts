import {Component, Input, OnInit, Optional, ViewChild} from '@angular/core';
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
import {SpecialOffer} from "@app/_models/special-offer";
import {type} from "os";

@Component({
  selector: 'app-product-modal',
  templateUrl: './product-modal.component.html',
  styleUrls: ['./product-modal.component.scss']
})
export class ProductModalComponent implements OnInit {

  quantityCurrent: number = 1;
  cartCurrent: Cart;
  infos: string;
  lists: ListSupplements[] = [];
  supplementProducts: Supplement[] = [];
  listSelected: ListSupplements;
  supplementsSelected = new FormControl();
  listRequired: ListSupplements[] = [];
  listSeee: number;
  hasListRequired: boolean;
  showSpinner;
  @ViewChild('listSup') listSup;
  @ViewChild('listSdf') listSdf;
  @Input() product: Product;
  @Input() restaurant: any;
  @Optional() specialOffer: SpecialOffer;
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
      // this.product.remaining_quantity -= this.quantityCurrent;
      this.product = Object.assign({}, this.product);
      if (typeof this.specialOffer !== 'undefined') {
        this.restaurant.specialOffer = this.specialOffer;
      }
      this.cartService.UpdateCart('add', this.product, this.restaurant);
      setTimeout(() => {
        this.modalActive.close(this.product);
      }, 100);
 }

 onChange(event: MatSelectionListChange, list: ListSupplements) {
   const sup = event.option.value;
   sup.isSelected = event.option.selected;
   this.productListSupplement(sup, list, event);
 }


 onRadioChange(event: MatRadioChange, list: ListSupplements) {
    const sup = event.value;
   if (typeof this.product.listSupplements === 'undefined') {
     this.product.listSupplements = [];
   }
   const indexListAlreadyExists = this.product.listSupplements.findIndex(elem =>
     elem.id === list.id);
   this.listSelected = Object.assign({}, list);

   if (indexListAlreadyExists === -1) {
     this.listSelected.supplementProducts = [sup];
     this.product.listSupplements = [...this.product.listSupplements, this.listSelected];
     console.warn('aj list', this.product.listSupplements);
   } else if (indexListAlreadyExists !== -1) {
     this.product
       .listSupplements[indexListAlreadyExists]
       .supplementProducts = this.product
       .listSupplements[indexListAlreadyExists]
       .supplementProducts
       .filter(s => typeof s !== 'undefined' && s != null);
   }
   this.listRequired = this.listRequired.filter(
     elem => elem != null
       && typeof elem !== 'undefined'
       && elem.id !== this.listSelected.id);
   if (this.listRequired.length === 0 && this.hasListRequired === true) {
     this.hasListRequired = !this.hasListRequired;
   }
 }
 onChangeSupplement(event: MatSelectionListChange): void {
   const supplementSelected = event.option.value;
   if (event.option.selected) {

     if (supplementSelected.amount !== null && +(supplementSelected.amount) > 0) {
        this.product.amount += supplementSelected.amount;
      }
      if (typeof this.product.supplementProducts === 'undefined' || this.product.supplementProducts.length === 0) {
        this.product.supplementProducts = [event.option.value];
      } else {
        this.product.supplementProducts = [...this.product.supplementProducts, event.option.value];
      }
    } else {
     if (supplementSelected.amount !== null && +(supplementSelected.amount) > 0) {
       this.product.amount -= supplementSelected.amount;
       this.product.supplementProducts = this.product.supplementProducts.filter((sup) => {
         return +(sup.id) !== +(supplementSelected.id) ? sup : '';
       });
     }
   }
 }

 private productListSupplement(sup: Supplement, list: ListSupplements, event?: MatSelectionListChange) {
   if (typeof this.product.listSupplements === 'undefined') {
     this.product.listSupplements = [];
   }
   const indexListAlreadyExists = this.product.listSupplements.findIndex(elem =>
    elem.id === list.id);
   this.listSelected = Object.assign({}, list);

   if (indexListAlreadyExists === -1 && sup.isSelected === true) {
     this.listSelected.supplementProducts = [sup];
     this.product.listSupplements = [...this.product.listSupplements, this.listSelected];
     console.warn('aj list', this.product.listSupplements);

   } else if (indexListAlreadyExists !== -1 && sup.isSelected === true) {
     this.product
       .listSupplements[indexListAlreadyExists]
       .supplementProducts = this.product
       .listSupplements[indexListAlreadyExists]
       .supplementProducts
       .filter(s => typeof s !== 'undefined' && s != null);
     if (
       this.product
         .listSupplements[indexListAlreadyExists]
         .supplementProducts.length <= +(list.maxChoice)
     ) {
         this.product
           .listSupplements[indexListAlreadyExists]
           .supplementProducts = [
           ...this.product
             .listSupplements[indexListAlreadyExists]
             .supplementProducts, sup
         ];

         if (this.product
           .listSupplements[indexListAlreadyExists]
           .supplementProducts.length === list.maxChoice) {
           list.isAvailable = false;
         }
       } else {
       if (
         this.product
           .listSupplements[indexListAlreadyExists]
           .supplementProducts.length > +(list.maxChoice)
       ) {
         event.option.selected = false;
         this.product.listSupplements[indexListAlreadyExists].isAvailable = false;
         list.isAvailable = false;
         this.product.listSupplements[indexListAlreadyExists].supplementProducts.forEach((elem) => {
           if (elem) {
             if (+(elem.id) === +(sup.id)) {
               elem.isSelected = false;
             }
           }
         });
         list.supplementProducts.forEach((elem) => {
           if (+(elem.id) === +(sup.id)) {
             elem.isSelected = false;
           }
         });
       }
     }
   } else if (sup.isSelected === false) {
     list.isAvailable = true;
     this.product
       .listSupplements[indexListAlreadyExists].isAvailable = true;
     this.product
       .listSupplements[indexListAlreadyExists]
       .supplementProducts = this.product
       .listSupplements[indexListAlreadyExists]
       .supplementProducts
       .filter(supplement =>
         +(sup.id) !== +(supplement.id)
         && typeof supplement !== 'undefined'
         && supplement != null
       );
   }

   console.log('list du produit', this.product.listSupplements);

   this.listRequired = this.listRequired.filter((elem) => {
     return elem.id !== this.listSelected.id;
   });
   if (this.listRequired.length === 0 && this.hasListRequired === true) {
     this.hasListRequired = !this.hasListRequired;
   }
 }


}
