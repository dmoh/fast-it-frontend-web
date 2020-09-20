import { Component, OnInit } from '@angular/core';
import {RestaurantDashboardService} from '@app/restaurants/restaurant-dashboard/services/restaurant-dashboard.service';
import {RestaurantDashboardComponent} from '@app/restaurants/restaurant-dashboard/restaurant-dashboard.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {UpdateDialogComponent} from '@app/restaurants/restaurant-dashboard/product/update-dialog/update-dialog.component';
import {Product} from "@app/models/product";
import {UploadService} from "@app/_services/upload.service";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  restaurantDatas: any;
  restaurant: any;
  productsResto: any[];
  productBeforeUpdate: any;
  constructor(private restaurantService: RestaurantDashboardService,
              public dialog: MatDialog,
              public uploadService: UploadService  ) { }

  ngOnInit(): void {
    this.restaurantService.getRestaurantDatas(1).subscribe((res) => {
      this.restaurant = RestaurantDashboardComponent.extractRestaurantData('business', res);
      this.productsResto = RestaurantDashboardComponent.extractRestaurantData('product', res);
      console.log(this.productsResto);
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


  openDialog(product?: any): void {
    if (!product) {
      product = new Product();
    }
    // add business id to product
    product = Object.assign({business_id: this.restaurant.id }, product);
    this.productBeforeUpdate = Object.assign({}, product);
    console.log(this.productBeforeUpdate);
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
        console.warn(result);
        result['business_id'] = this.restaurant.id;
        const formData = new FormData();
        formData.append('product', JSON.stringify(result));
        console.warn(result);
        if (result.photo) {
          formData.append('photo', result.photo);
          delete result.photo;
        }
        this.uploadService.upload(formData, 0, true)
          .subscribe((resp) => {
              console.log(resp);
            }, (error) => {
              console.warn(error);
            }
          );
        /*this.restaurantService
          .updateProduct(JSON.stringify(result))
          .subscribe((resp) => {
              console.log(resp);
            }, (error) => {
              console.warn(error);
            }
          );*/
      }
    });
  }

}
