import { Component, OnInit } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {SubscriptionModalComponent} from "@app/subscription/subscription-modal/subscription-modal.component";
import {UserService} from "@app/_services/user.service";
import {subscription, subscriptionName} from "@app/_util/fasteat-constants";
import {AuthenticationService} from "@app/_services/authentication.service";
import {User} from "@app/_models/user";

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
  constructor(private userService: UserService,
              private authentication: AuthenticationService,
              public dialog: MatDialog) { }

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
          this.dialog.open(SubscriptionModalComponent, {
            autoFocus: false,
            data: {
              typeSub: typeSubscription,
              amountSub: amount,
              subName: subName,
              paymentMethodToken: this.paymentMethodToken,
              pan: this.pan
            }
          })
        });
  }
}
