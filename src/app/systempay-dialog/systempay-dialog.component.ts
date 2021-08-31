import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import KRGlue from "@lyracom/embedded-form-glue";
import {environment} from "@environments/environment";
import {RestaurantDashboardService} from "@app/restaurants/restaurant-dashboard/services/restaurant-dashboard.service";


@Component({
    selector: 'app-systempay-dialog',
    templateUrl: './systempay-dialog.component.html',
    styleUrls: ['./systempay-dialog.component.scss']
})
export class SystempayDialogComponent implements OnInit {
    publicKey = environment.publicKeySystempay;
    endpoint = 'https://api.systempay.fr';
    paymentMethodToken: string;
    error: any;
    paymentSuccessful: boolean = false;
    submitted: boolean = false;
    pan: string;
    dataPayment: {}|false;
    showButtonCard: boolean = false;
    showCancelButton: boolean = true;

    constructor(
        private restaurantDashboardService: RestaurantDashboardService,
        public dialogRef: MatDialogRef<SystempayDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { total, paymentMethodToken, pan },
    ) {
    }

    ngOnInit(): void {
        if (this.data.paymentMethodToken) {
           this.paymentMethodToken = this.data.paymentMethodToken;
           this.showButtonCard = true;
           this.pan = this.data.pan;
        } else {
            this.getFormToken();
        }
    }


    private getFormToken(useDefaultCard?: boolean) {
        this.paymentMethodToken = null;
        let _this = this;
        if (useDefaultCard) {
            if (this.data.paymentMethodToken) {
                this.paymentMethodToken = this.data.paymentMethodToken;
            }
        }
        this.restaurantDashboardService
            .initSystemPay(this.data.total, this.paymentMethodToken)
            .subscribe((res) => {
                    if (res.error || res.formToken === null) {
                        this.error = res.error;
                        return;
                    }
                    const dialog = this.dialogRef;
                    KRGlue.loadLibrary(this.endpoint, this.publicKey) /* Load the remote library */
                        .then(({KR}) =>
                            KR.setFormConfig({
                                formToken: res.formToken, // this.data.formToken,
                                "kr-language": "fr-FR" /* to update initialization parameter */
                            })
                        )
                        .then(({KR}) =>
                            KR.addForm("#myPaymentFormSystemPay")
                        )
                        .then(({KR, result}) => {
                            KR.showForm(result.formId);

                            KR.onSubmit(onPaid)
                                .then(() => {
                                    this.showCancelButton = false;
                                    setTimeout(() => {},0);
                                });

                            function onPaid(event) {
                                setTimeout(() => {},0);
                                if (event.clientAnswer.orderStatus === "PAID") {
                                    // Remove the payment form
                                    dialog.close({
                                        dataPayment: event.clientAnswer
                                    });
                                    KR.removeForms();
                                    // return event.clientAnswer;
                                } else {
                                    // Show error message to the user
                                    document.getElementById("paymentFailed").style.display = "block";
                                    document.getElementById("paymentSuccessful").style.display = "none";
                                    document.getElementById("cancel-button").style.display = "none";
                                    //return false;
                                }

                            }
                        })
                    ; /* show the payment form */
                }
            );

    }



    onCancelPayment() {
        this.dialogRef.close('cancel');
    }

    onRetry() {
        this.error = null;
        this.getFormToken();
    }

    onUseDefaultCard(response: string) {
        this.showButtonCard = false;
        if (response === 'ok') {
            this.getFormToken(true);
        } else {
            this.getFormToken();
        }
    }

    onPaymentSuccess(dataPayment: {}) {
        this.dialogRef.close({
            dataPayment: dataPayment
        });
    }
}
