import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Restaurant} from "@app/_models/restaurant";
import {CategoryProduct} from "@app/_models/category-product";
import {Product} from "@app/models/product";
import {RestaurantDashboardService} from "@app/restaurants/restaurant-dashboard/services/restaurant-dashboard.service";

@Component({
  selector: 'app-add-product-dialog',
  templateUrl: './add-product-dialog.component.html',
  styleUrls: ['./add-product-dialog.component.scss']
})
export class AddProductDialogComponent implements OnInit {

  productsWithoutCategory: Product[];
  selectedProductId: any[] = [];
  constructor(public dialogRef: MatDialogRef<AddProductDialogComponent>,
              public restaurantDashboardService: RestaurantDashboardService,
              @Inject(MAT_DIALOG_DATA) public category: CategoryProduct) { }

  ngOnInit(): void {

    this.restaurantDashboardService.getProductListWithoutCategory(this.category.businessId)
      .subscribe((res) => {
        this.productsWithoutCategory = res;
      });
  }

  onChange() {
    console.warn(this.selectedProductId);
  }


}
