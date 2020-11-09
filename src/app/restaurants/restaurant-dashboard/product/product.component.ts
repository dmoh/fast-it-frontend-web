import { Component, OnInit } from '@angular/core';
import {RestaurantDashboardService} from '@app/restaurants/restaurant-dashboard/services/restaurant-dashboard.service';
import {RestaurantDashboardComponent} from '@app/restaurants/restaurant-dashboard/restaurant-dashboard.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {UpdateDialogComponent} from '@app/restaurants/restaurant-dashboard/product/update-dialog/update-dialog.component';
import {Product} from '@app/models/product';
import {UploadService} from '@app/_services/upload.service';
import {CategoryProductComponent} from '@app/restaurants/restaurant-dashboard/category-product/category-product.component';
import {AddProductDialogComponent} from '@app/restaurants/restaurant-dashboard/category-product/add-product-dialog/add-product-dialog.component';
import {ActivatedRoute, Router} from "@angular/router";
import {SecurityRestaurantService} from "@app/_services/security-restaurant.service";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  restaurantDatas: any;
  restaurant: any;
  productsResto: any[];
  categories: any[];
  productBeforeUpdate: any;
  constructor(private restaurantService: RestaurantDashboardService,
              public dialog: MatDialog,
              public uploadService: UploadService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private securityRestaurantService: SecurityRestaurantService
              ) { }

  ngOnInit(): void {
    this.updateProductList();
  }

  updateProductList(restaurantId?: number) {
    this.securityRestaurantService.getRestaurant()
      .subscribe((restaurantObj) => {
        if (!isNaN(restaurantObj.id)) {
          this.restaurantService.getRestaurantDatas(restaurantObj.id).subscribe((res) => {
            this.restaurant = RestaurantDashboardComponent.extractRestaurantData('business', res);
            if (this.restaurant === null && +(restaurantObj.id) > 0) {
              this.restaurantService.getRestaurantInfosById(restaurantObj.id)
                .subscribe((restaurantDb) => {
                  this.restaurant = restaurantDb.restaurant;
                });
            }
            this.productsResto = RestaurantDashboardComponent.extractRestaurantData('product', res);
            this.restaurantService.getCategoriesByBusinessId(restaurantObj.id)
              .subscribe((cat) => {
                this.categories = cat;
              });
          });
        } else {
          this.router.navigate(['home']);
        }
      });
  }

  onDelete(type: string, {product, supplement}): void {
    switch (type) {
      case 'supplement':
        this.productsResto = this.productsResto.filter((prod) => {
           if (+(prod.id) === product.id) {
             prod.supplmentsProduct = prod.supplmentsProduct.filter((elem) => {
               return elem.id !== supplement;
             });
           }
           return prod;
        });
        break;
        case 'product':
        this.productsResto = this.productsResto.filter((prod) => {
           return prod.id !== product.id;
        });
        break;
    }
  }


  openDialog(product?: Product): void {
    if (!product) {
      product = new Product();
    }
    // add business id to product
    product = Object.assign({business_id: this.restaurant.id }, product);
    this.productBeforeUpdate = Object.assign({}, product);
    const dialogRef = this.dialog.open(UpdateDialogComponent, {
      width: '60%',
      data: product
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'no-update') {
        this.productsResto = this.productsResto.filter((prod) => {
          if (prod.id === product.id) {
            prod = this.productBeforeUpdate;
          }
          return prod;
        });
      } else {
        result.business_id = this.restaurant.id;
        const formData = new FormData();
        formData.append('product', JSON.stringify(result));
        console.warn(result);
        if (result.photo) {
          formData.append('photo', result.photo);
          delete result.photo;
        }
        this.uploadService.upload(formData, 0, true)
          .subscribe((resp) => {
              this.updateProductList(this.restaurant.id);
            }, (error) => {
              console.warn(error);
            }
          );
      }
    });
  }

  onGetProductByCategory(categoryId: number): void {
    this.restaurantService.getProductByCategoryId(categoryId)
      .subscribe((prod) => {
        this.categories.forEach((cat, index) => {
          if (cat.id === categoryId) {
            this.categories[index].products = prod;
          }
        });
      });
  }


  onAddProductToCategory(category): void {
    const dialogRef = this.dialog.open(AddProductDialogComponent, {
      width: '60%',
      data: category
    });

    dialogRef.afterClosed()
      .subscribe((res) => {
        if (typeof res !== 'undefined') {
          this.onGetProductByCategory(res.ok);
        }
      });
  }

  addCategory(): void {
    const dialogRef = this.dialog.open(CategoryProductComponent, {
      width: '60%',
      data: this.restaurant
    });
    dialogRef.afterClosed()
      .subscribe((res) => {
        if (res) {
          this.restaurantService.addCategoryToRestaurant(res)
            .subscribe((response) => {
              if (response.ok) {
                console.log(response);
                this.categories = [...this.categories, response.category];
              }
            });
        }
      });
  }

}
