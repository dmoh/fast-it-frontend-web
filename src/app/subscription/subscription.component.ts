import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {SubscriptionModalComponent} from "@app/subscription/subscription-modal/subscription-modal.component";
import {UserService} from "@app/_services/user.service";
import {subscription, subscriptionName} from "@app/_util/fasteat-constants";
import {AuthenticationService} from "@app/_services/authentication.service";
import {User} from "@app/_models/user";
import {Router} from "@angular/router";

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {

  BASIC_AMOUNT: number = 499;
  MEDIUM_AMOUNT: number = 599;
  PREMIUM_AMOUNT: number = 899;
  codeSub = subscription;
  nameSub = subscriptionName;
  paymentMethodToken = '';
  pan = '';
  user: any;
  subscriptionChoose: string;
  showSuccessMessage: boolean;
  constructor(private userService: UserService,
              private authentication: AuthenticationService,
              private router: Router,
              public dialog: MatDialog,

  ) { }

  ngOnInit(): void {
    this.authentication.currentUser.subscribe((res) => {
      this.user = !res ? new User() : res;
    });
  }

  onOpenSubscriptionModal(typeSubscription: number, subName: string,amount: number) {
    this.userService
        .getUserAddresses()
        .subscribe((result) => {
          this.paymentMethodToken = result.data[0].paymentMethodToken;
          this.pan = result.data[0].pan;
          const dialogRef = this.dialog.open(SubscriptionModalComponent, {
            autoFocus: false,
            data: {
              typeSub: typeSubscription,
              amountSub: amount,
              subName: subName,
              paymentMethodToken: this.paymentMethodToken,
              pan: this.pan
            }
          });

          dialogRef
              .afterClosed()
              .subscribe((response) => {
                if (response && response.payment) {
                  // payment success
                  //save transaction on db
                  // lunch subscription to systempay
                  // save properly subscriptio and subscriptionCapacity
                  // save survey if is an artist or other
                  // reload user
                  this.showSuccessMessage = true;
                  this.subscriptionChoose = response.subscription.title;
                  this.authentication.addSubscriptionDataUser(response.subscription);
                  setTimeout(() => {
                      this.router.navigateByUrl('/home', {skipLocationChange: true}).then(() => {
                          this.router.navigate(['home']);
                      });
                  }, 4000);
                }
              });
        });
  }
}
