import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {RestaurantDashboardService} from '@app/restaurants/restaurant-dashboard/services/restaurant-dashboard.service';

@Component({
  selector: 'app-update-dialog',
  templateUrl: './update-dialog.component.html',
  styleUrls: ['./update-dialog.component.scss']
})
export class UpdateDialogComponent implements OnInit {

  constructor(
    private restaurantDashboardService: RestaurantDashboardService,
    public dialogRef: MatDialogRef<UpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public product: any) {}

  ngOnInit(): void {
  }
  onNoClick(): void {
    this.dialogRef.close('no-update');
  }

  onSaveProduct(product: any): void {
    this.dialogRef.close(product);
  }
}
