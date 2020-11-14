import {Component, HostListener, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ProductModalComponent} from '@app/product-modal/product-modal.component';
import {Product} from '@app/models/product';
import {CartService} from '@app/cart/service/cart.service';
import {Cart} from '@app/cart/model/cart';
import {RestaurantDashboardService} from '@app/restaurants/restaurant-dashboard/services/restaurant-dashboard.service';
import {ActivatedRoute} from '@angular/router';
import {SecurityRestaurantService} from '@app/_services/security-restaurant.service';
import {InfoModalComponent} from "@app/info-modal/info-modal.component";

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
  urlBackgroundRestaurant: string;
  urlLogoRestaurant: string;
  restaurant: any = {} as any;
  nothingToShow: string;
  constructor(private modal: NgbModal,
              private cartService: CartService,
              private restaurantService: RestaurantDashboardService,
              private route: ActivatedRoute,
              private securityRestaurantService: SecurityRestaurantService
              ) {

  }

  ngOnInit(): void {

    this.starsRestaurant = [1, 3, 4, 5, 4];
    this.route.params.subscribe((params => {
      this.restaurantId = +params.id;
      this.restaurantService.getRestaurantMedias(this.restaurantId)
        .subscribe((res) => {
          res.forEach((media) => {
            if (media.type_media === 'logo') {
              this.urlLogoRestaurant = media.path_file;
            }
            if (media.type_media === 'background_img') {
              this.urlBackgroundRestaurant = media.path_file;
            }
          });
        });

      this.restaurantService.getRestaurantProductsDatas(this.restaurantId)
        .subscribe((result) => {
          this.restaurantDatas = result;
          if (this.restaurantDatas.length > 0 ) {
            this.restaurantDatas.forEach((restau) => {
              if (restau.product.business) {
                this.restaurant = restau.product.business;
                if (restau.product.tags) {
                  this.restaurant.tags = restau.product.tags;
                }
              }
              if (restau.product.categoryProduct) {
                const prod = restau.product;
                const categoryProduct = {
                  category_name: prod.categoryProduct.name,
                  category_id: prod.categoryProduct.id,
                  category_label: prod.categoryProduct.name,
                  category_position: prod.categoryProduct.position,
                  category_products: []
                };
                const category = restau.product.categoryProduct;
                const isCategorySet = this.categoryExistArray(category.id);
                if (isCategorySet === -1) {
                  categoryProduct.category_products = [restau.product, ...categoryProduct.category_products];
                  this.categories = [categoryProduct, ...this.categories];
                } else {
                  this.categories[isCategorySet].category_products = [restau.product, ...this.categories[isCategorySet].category_products];
                }
              }
              this.products = [restau.product, ...this.products];
              this.categories = this.categories.sort( (a, b) => {

                return a.category_position - b.category_position;
              });
            });
          } else {
            this.nothingToShow = 'Ce restaurant n\'a aucun produit en vente pour le moment';
          }
        });
    }));

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
    if (typeof this.cartService.getBusinessCurrent() !== 'undefined' && this.cartService.getBusinessCurrent().id !== this.restaurantId) {
        const modalInfo = this.modal.open(InfoModalComponent, {
          backdrop: 'static',
          keyboard: false,
        });
        modalInfo.componentInstance.title = 'INFORMATION';
        modalInfo.componentInstance.message = 'Il est impossible de commander dans deux restaurants pour une seule livraison';
    } else {
      if (product.is_available === true || product.is_available === null) {
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
  }



}
