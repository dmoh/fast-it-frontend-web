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
import {CategoryProduct} from "@app/_models/category-product";
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  restaurantDatas: any;
  restaurant: any;
  productsResto: Product[];
  categories: any[];
  productBeforeUpdate: any;
  constructor(private restaurantService: RestaurantDashboardService,
              public dialog: MatDialog,
              public uploadService: UploadService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private securityRestaurantService: SecurityRestaurantService,
              private snackBar: MatSnackBar,
              ) { }

  ngOnInit(): void {
    this.updateProductList();
  }

  updateProductList(restaurantId?: number, reload?: string) {
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
            this.restaurantService.getProductListByBusinessId(restaurantObj.id)
              .subscribe((responseDb) => {
                this.productsResto = responseDb.products;
              });
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
             prod.supplementsProduct = prod.supplementsProduct.filter((elem) => {
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

    if (product.category === null) {
      product.category = new CategoryProduct();
      product.category.id = 0;
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
        const updatedProduct = result;
        console.warn('res', result);
        if (updatedProduct.category.id === 0) {
          result.category = null;
        }
        formData.append('product', JSON.stringify(result));
        if (result.photo) {
          formData.append('photo', result.photo);
          delete result.photo;
        }
        this.uploadService.upload(formData, 0, true)
          .subscribe((resp) => {
              this.reloadProduct(this.restaurant.id);
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


  private reloadProduct(restaurantId: number) {
    this.restaurantService.getProductListByBusinessId(restaurantId)
      .subscribe((responseDb) => {
        this.productsResto = responseDb.products;
      });
    this.restaurantService.getCategoriesByBusinessId(restaurantId)
      .subscribe((cat) => {
        this.categories = cat;
      });
  }

  onValidatePosition() {
    let catPosition = [];
    this.categories.forEach((category, index) => {
      catPosition = [...catPosition, {categoryId: category.id, position: index++}];
    });

    this.restaurantService.updateCategoryProductPosition(catPosition)
      .subscribe((res) => {
        this.snackBar.open('Positionnement enregistré', '', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      });
  }

  drop(event: CdkDragDrop<CategoryProduct[]>) {
    moveItemInArray(this.categories, event.previousIndex, event.currentIndex);
  }
}
