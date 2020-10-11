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
    @Inject(MAT_DIALOG_DATA) public product: Product) {}

  ngOnInit(): void {
    this.restaurantDashboardService.getCategoriesByBusinessId(this.product.business_id)
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
    this.dialogRef.close(this.product);
  }


  onFileChange(event) {
    if (event.target.files.length > 0) {
      this.product.photo = event.target.files[0];
    }
  }
}
