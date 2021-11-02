import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {TermsModalComponent} from "@app/terms-modal/terms-modal.component";
import {SystempayDialogComponent} from "@app/systempay-dialog/systempay-dialog.component";
import {SubscriptionService} from "@app/_services/subscription.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-subscription-modal',
  templateUrl: './subscription-modal.component.html',
  styleUrls: ['./subscription-modal.component.scss']
})
export class SubscriptionModalComponent implements OnInit {

  paymentMethodToken = '';
  pan = '';
  showValidationButton: boolean = true;
  choiceFormControl = new FormControl('');
  formGroup: FormGroup;

  constructor(
      private subService: SubscriptionService,
      private dialog: MatDialog,
      private fb: FormBuilder,
      @Inject(MAT_DIALOG_DATA) public data: {typeSub: number, nameSub: string, amountSub: number})
  {
    this.formGroup = fb.group({
      choiceUser: ['fast-it', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  onShowTerms() {
    this.dialog.open(TermsModalComponent, {
      autoFocus: false
    });
  }

  onValidate() {
    // who is ?
    // has token PAyment
    // or show formPayment

    if (+this.data.amountSub === 0 || this.formGroup.invalid) {
      return;
    }
    let data = {total: this.data.amountSub, paymentMethodToken: null, pan: null, isSubscription: true};
    if (this.paymentMethodToken) {
      data.paymentMethodToken = this.paymentMethodToken;
    }
    if (this.pan) {
      data.pan = this.pan;
    }
    const dialogRef = this.dialog.open(SystempayDialogComponent, {
      data: data,
      hasBackdrop: true,
      disableClose: true,
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dataPayment) {
        // save subscription db
        this.showValidationButton = false;
        //ne pas oublier lartiste
        this.subService.updateSubscription({
          payment: result.dataPayment,
          id: 0,
          amount: this.data.amountSub,
          typeSub: this.data.typeSub,
          nameSub: this.data.nameSub,
          isActive: true,
          isCancel: false,
          isLocked: true,
          survey: this.formGroup.get('choiceUser').value
        })
      }
    });

  }
}
