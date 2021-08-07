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

    constructor(
        private restaurantDashboardService: RestaurantDashboardService,
        public dialogRef: MatDialogRef<SystempayDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { total, paymentMethodToken },
    ) {
    }

    ngOnInit(): void {
        if (this.data.paymentMethodToken) {
            this.paymentMethodToken = this.data.paymentMethodToken;
        }
        this.getFormToken();
    }


    private getFormToken() {
        this.restaurantDashboardService
            .initSystemPay(this.data.total, this.paymentMethodToken ? this.paymentMethodToken : null)
            .subscribe((res) => {
                    if (res.error || res.formToken === null) {
                        this.error = res.error;
                        return;
                    }
                    KRGlue.loadLibrary(this.endpoint, this.publicKey) /* Load the remote library */
                        .then(({KR}) =>
                            KR.setFormConfig({
                                formToken: res.formToken, // this.data.formToken,
                                "kr-language": "fr-FR" /* to update initialization parameter */
                            })
                        )
                        .then(({KR}) =>
                            KR.addForm("#myPaymentFormSystemPay")
                        ) /* add a payment form  to myPaymentForm div*/
                        .then(({KR, result}) =>
                            KR.showForm(result.formId)
                                .then(({KR, res}) => {
                                    KR.onSubmit(this.onPaid(res));
                                }
                            )
                        )
                    ; /* show the payment form */
                }
            );

    }

    onPaid(event) {
        console.warn('event submission pay', event);
        if (event.clientAnswer.orderStatus === "PAID") {
            // Remove the payment form

            // Show success message
            document.getElementById("paymentSuccessful").style.display = "block";
        } else {
            // Show error message to the user
            alert("Payment failed !");
        }
    }

    onCancelPayment() {
        this.dialogRef.close('cancel');
    }

    onRetry() {
        this.error = null;
        this.getFormToken();
    }
}
