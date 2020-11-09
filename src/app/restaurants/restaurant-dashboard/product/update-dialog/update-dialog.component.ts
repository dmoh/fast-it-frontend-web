import {Component, Inject, OnInit, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {RestaurantDashboardService} from '@app/restaurants/restaurant-dashboard/services/restaurant-dashboard.service';
import {Product} from "@app/models/product";

@Component({
  selector: 'app-update-dialog',
  templateUrl: './update-dialog.component.html',
  styleUrls: ['./update-dialog.component.scss']
})
export class UpdateDialogComponent implements OnInit {

  photo: any;
  categories: any[] = [];
  @Optional() restaurantId: number;
  constructor(
    private restaurantDashboardService: RestaurantDashboardService,
    public dialogRef: MatDialogRef<UpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public product: Product
  ) {}

  ngOnInit(): void {
    console.log(this.product);
    if (this.product.amount && +(this.product.amount) > 0) {
      this.product.amount = +(this.product.amount) / 100;
    }
    this.restaurantDashboardService
      .getCategoriesByBusinessId(this.product.business_id)
      .subscribe((cats) => {
        this.categories = cats;
        console.log(this.categories);
      });
  }
  onNoClick(): void {
    this.dialogRef.close('no-update');
  }

  onSaveProduct(product: any): void {
    console.log(this.product);
    console.log(this.product);
    return;
    this.dialogRef.close(this.product);
  }

  onChange(event) {
    console.log(this.product.isAvailable);
    console.log(this.product);
  }

  onChangeAmount() {
    // display prix affiché
    if (this.product.amount > 10 ) {

    }
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      this.product.photo = event.target.files[0];
    }
  }
}
