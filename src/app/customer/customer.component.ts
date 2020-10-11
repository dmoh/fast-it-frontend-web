import { Component, OnInit } from '@angular/core';
import {CustomerService} from "@app/customer/_services/customer.service";
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {NotificationsComponent} from "@app/notifications/notifications.component";



@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {

  customer: any;
  notifications: any[];
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(
    private customerService: CustomerService,
    private snackBar: MatSnackBar,
    private bottomSheet: MatBottomSheet
  ) { }

  ngOnInit(): void {
    this.customerService.getInfosCustomer()
      .subscribe((response) => {
        console.warn(response);
        this.customer = response[0];
        this.customerService.getNotificationsCustomer()
          .subscribe((notif) => {
            this.notifications = notif;
          });
      });
  }

  onReadNotifications() {
    setTimeout(() => {
      this.customerService.sendNotificationsRead(this.customer.notifications, {user: this.customer.id})
        .subscribe((res) => {
          this.notifications = [];
        });
    }, 5000);
  }
  openSnackBar() {
    /*this.snackBar.open('Cannonball!!', 'End now', {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });

    const bottomSheetRef = this.bottomSheet.open(NotificationsComponent,{
      data: { notifications: this.customer.notifications }
    });
    bottomSheetRef.afterDismissed().subscribe(() => {
      this.customerService.sendNotificationsRead(this.customer.notifications, {user: this.customer.id})
        .subscribe((res) => {
          this.notifications = [];
        });
    });*/
  }
}
