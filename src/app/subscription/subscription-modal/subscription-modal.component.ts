import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {TermsModalComponent} from "@app/terms-modal/terms-modal.component";
import {SystempayDialogComponent} from "@app/systempay-dialog/systempay-dialog.component";
import {SubscriptionService} from "@app/_services/subscription.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "@app/_models/subscription";

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
  denyTerms: boolean;

  constructor(
      private subService: SubscriptionService,
      private dialog: MatDialog,
      private dialogRef: MatDialogRef<SubscriptionModalComponent>,
      private fb: FormBuilder,
      @Inject(MAT_DIALOG_DATA) public data: {
        subName: string;
        typeSub: number, nameSub: string, amountSub: number})
  {
    this.formGroup = fb.group({
      choiceUser: ['fast-it', Validators.required],
      acceptTerms: [false, [Validators.required]]
    });
    this.denyTerms = true;
  }

  ngOnInit(): void {
    this.formGroup.valueChanges
        .subscribe((val) => {
          if (val.acceptTerms === false) {
            this.formGroup.controls['acceptTerms']
                .setErrors({'incorrect': true});
          }else {
            this.formGroup.controls['acceptTerms']
                .setErrors(null);
            this.denyTerms = false;
          }
        });
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
        /*let sub = new Subscription();
        sub.subType = this.data.typeSub;
        sub.amount = this.data.amountSub;
        sub.title = this.data.nameSub;
        sub.isActive = true;
        sub.isCancel = false;
        sub.isLocked = true;*/
        this.subService.updateSubscription({
          payment: result.dataPayment,
          id: 0,
          amount: this.data.amountSub,
          typeSub: this.data.typeSub,
          title: this.data.subName,
          isActive: true,
          isCancel: false,
          isLocked: false,
          survey: this.formGroup.get('choiceUser').value,
          acceptTerms: this.formGroup.get('acceptTerms').value
        }).subscribe((res) => {
          if (res.ok) {
            this.dialogRef.close({
              payment: result.dataPayment,
              subscription: res.subscription
            });
          }
        });
      }
    });

  }
}
