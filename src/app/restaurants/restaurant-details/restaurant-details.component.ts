import { Component, OnInit } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ProductModalComponent} from '@app/product-modal/product-modal.component';
import {Product} from '@app/models/product';
import {CartService} from '@app/cart/service/cart.service';
import {Cart} from '@app/cart/model/cart';
import {RestaurantDashboardService} from '@app/restaurants/restaurant-dashboard/services/restaurant-dashboard.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-restaurant-details',
  templateUrl: './restaurant-details.component.html',
  styleUrls: ['./restaurant-details.component.scss']
})
export class RestaurantDetailsComponent implements OnInit {

  cartCurrent: Cart;
  starsRestaurant: any[] = [];
  products: any[] = [];
  categories: any[] = [];
  restaurantId: number;
  restaurantDatas: any;
  restaurant: any = {} as any;
  constructor(private modal: NgbModal,
              private cartService: CartService,
              private restaurantService: RestaurantDashboardService,
              private route: ActivatedRoute
              ) {
    this.route.params.subscribe((params => {
      this.restaurantId = +params.id;
    }));
  }

  ngOnInit(): void {
    this.starsRestaurant = [1, 3, 4, 5, 4];
    this.restaurantService.getRestaurantProductsDatas(this.restaurantId)
      .subscribe((result) => {
        this.restaurantDatas = result;
        if (this.restaurantDatas.length > 0 ) {
          this.restaurantDatas.forEach((restau) => {
            if (restau.business) {
              this.restaurant = restau.business;
              if (restau.product) {
                this.restaurant.tags = restau.product.tags;
              }
            } else {
              if (restau.product.category) {
                const prod = restau.product;
                const categoryProduct = {
                  category_name: prod.category.name,
                  category_id: prod.category.id,
                  category_label: prod.category.name,
                  category_products: []
                };
                const category = restau.product.category;
                const isCategorySet = this.categoryExistArray(category.id);
                if (isCategorySet === -1) {
                  categoryProduct.category_products = [restau.product, ...categoryProduct.category_products];
                  this.categories = [categoryProduct, ...this.categories];
                } else {
                  this.categories[isCategorySet].category_products = [restau.product, ...this.categories[isCategorySet].category_products];
                }
              }
              this.products = [restau.product, ...this.products];
            }
          });
        }
      });
  }

  scroll(id) {
      const elmnt = document.getElementById(id);
      elmnt.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
  }

  categoryExistArray(id: number): number {
    let response = -1;
    response = this.categories.findIndex((elem) => {
       return elem.category_id === id;
    });
    return response;
  }
  openModal(product: Product): void {
    console.log(product);
    
    const modal = this.modal.open(ProductModalComponent);
    modal.componentInstance.product = product;
    modal.componentInstance.restaurant = this.restaurant;
    modal.result.then((prod: Product) => {
      if (prod) {
          this.cartService.cartUpdated.subscribe((cart: Cart) => this.cartCurrent = cart);
      }
    });
  }

}
