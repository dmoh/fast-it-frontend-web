import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Restaurant} from "@app/_models/restaurant";
import {CategoryProduct} from "@app/_models/category-product";

@Component({
  selector: 'app-category-product',
  templateUrl: './category-product.component.html',
  styleUrls: ['./category-product.component.scss']
})
export class CategoryProductComponent implements OnInit {

  category: CategoryProduct = new CategoryProduct();
  constructor(public dialogRef: MatDialogRef<CategoryProductComponent>,
              @Inject(MAT_DIALOG_DATA) public restaurant: Restaurant) { }

  ngOnInit(): void {
    this.category.business_id = this.restaurant.id;
  }
}
