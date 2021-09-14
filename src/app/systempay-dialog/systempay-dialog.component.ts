import {AfterViewInit, Component, Inject, OnInit, Renderer2, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import KRGlue from "@lyracom/embedded-form-glue";
import {environment} from "@environments/environment";
import {RestaurantDashboardService} from "@app/restaurants/restaurant-dashboard/services/restaurant-dashboard.service";


@Component({
    selector: 'app-systempay-dialog',
    templateUrl: './systempay-dialog.component.html',
    styleUrls: ['./systempay-dialog.component.scss']
})
export class SystempayDialogComponent implements OnInit, AfterViewInit {
    publicKey = environment.publicKeySystempay;
    endpoint = 'https://api.systempay.fr';
    paymentMethodToken: string;
    error: any;
    paymentSuccessful: boolean = false;
    submitted: boolean = false;
    pan: string;
    dataPayment: {};
    showButtonCard: boolean = false;
    showCancelButton: boolean = true;
    showPaymentValidateButton: boolean = false;
    @ViewChild('btnPaymentClose') btnPaymentClose;
    @ViewChild('paymentFull', {static: false}) paymentFull: any;
    @ViewChild('paymentFormSystemPay', {static: false}) paymentFormSystemPay: any;
    constructor(
        private renderer2: Renderer2,
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

    ngAfterViewInit() {
        this.paymentFull.nativeElement.display = 'none';
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
                            KR.onSubmit( (event) => {
                                if (event.clientAnswer.orderStatus === "PAID") {
                                    setTimeout(() => {
                                        this.paymentFull.nativeElement.style.display = "block";
                                        this.paymentFormSystemPay.nativeElement.style.display = "none";
                                        this.dataPayment = event.clientAnswer;
                                        this.dialogRef.close({
                                            dataPayment: event.clientAnswer
                                        });
                                    }, 50);
                                    KR.removeForms();
                                } else {}
                            }).then((val) => {
                                this.showCancelButton = false;
                                setTimeout(() => {},0);
                            });
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

    onPaymentSuccess() {
        this.dialogRef.close({
            dataPayment: this.dataPayment
        });
    }
}
