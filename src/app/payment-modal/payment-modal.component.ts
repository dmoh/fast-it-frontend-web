import { Component, OnInit } from '@angular/core';
import {HttpHeaders} from "@angular/common/http";
import {environment} from "@environments/environment";
import {CartService} from "@app/cart/service/cart.service";
import {RestaurantDashboardService} from "@app/restaurants/restaurant-dashboard/services/restaurant-dashboard.service";
import KRGlue from '@lyracom/embedded-form-glue';
import {Cart} from "@app/cart/model/cart";
import {UserService} from "@app/_services/user.service";

@Component({
  selector: 'app-payment-modal',
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.scss']
})
export class PaymentModalComponent implements OnInit {

  endpoint = 'https://api.systempay.fr';
  headers: HttpHeaders;
  publicKey = environment.publicKeySystempay;
  formToken: string;
  cartCurrent: Cart;
  amount: number = 0;
  constructor(
      private cartService: CartService,
      private restaurantDashboardService: RestaurantDashboardService,
      private userService: UserService
  ) { }

  ngOnInit(): void {
    // todo get token alias by user
    this.userService.getUserTokenAliasPayment()
        .subscribe((response) => {
           if (response.token) {

           }
        });
    this.restaurantDashboardService.initSystemPay(this.amount)
        .subscribe((res) => {
              if (res.formToken) {
                this.formToken = res.formToken;
                KRGlue.loadLibrary(this.endpoint, this.publicKey)
                  .then(({ KR }) =>
                    KR.setFormConfig({
                    // @ts-ignore
                    'formToken': res.formToken,
                    'kr-language': 'fr-FR'
                  }))
                .then(
                    ({ KR }) =>
                    KR.addForm('#formSystemPay')
                )
              .then(({ KR, result }) => {
                      KR.showForm(result.formId);
                      console.warn('resultat apres addForm', result);
                      KR.onSubmit(this.onPaid(result));
                    }
                ).then(({ KR, result }) => {
                          console.warn('resulta', KR);
                          console.warn('resultadfdf', result);
                          KR.onSubmit(this.onPaid(result));
                        }

                    )
                ;
              }
            })
    ;
  }


  onPaid(event) {
    console.warn('event sub', event);
    if (event.clientAnswer.orderStatus === "PAID") {
      document.getElementById("paymentSuccessful").style.display = "block";
    } else {
      // Show error message to the user
      alert("Payment failed !");
    }
  }
}
