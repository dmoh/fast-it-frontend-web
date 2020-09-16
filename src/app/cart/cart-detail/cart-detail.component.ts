import { Component, OnInit } from '@angular/core';
import {CartService} from '../service/cart.service';
import { Router} from '@angular/router';
import {Cart} from '../model/cart';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConfirmationCodePaymentModalComponent} from '@app/confirmation-code-payment-modal/confirmation-code-payment-modal.component';
import {AuthenticationService} from '@app/_services/authentication.service';
import {ErrorInterceptor} from '@app/_helpers/error.interceptor';
import {UserService} from '@app/_services/user.service';
import { AgmCoreModule } from '@agm/core';            // @agm/core
import { AgmDirectionModule } from 'agm-direction';
import {AddressModalComponent} from '@app/address-modal/address-modal.component';

@Component({
  selector: 'app-cart-detail',
  templateUrl: './cart-detail.component.html',
  styleUrls: ['./cart-detail.component.scss']
})
export class CartDetailComponent implements OnInit {
  stripe: any;
  elementStripe: any;
  cardNumber: any;
  cartCurrent: Cart;
  userAddresses: any[] = [];
  clientSecret: string;
  // todo declare constante frais de service
  SERVICE_CHARGE: number = 0.40;
  paymentValidated: boolean;
  canBeDeliver: boolean = false;

  static generateConfirmationCode(length: number = 4): string {
    const randomChars = '0123456789';
    let result = '';
    for ( let i = 0; i < length; i++ ) {
      result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
  }


  constructor(
    private cartService: CartService,
    private userService: UserService,
    private route: Router,
    private codeConfirmationModal: NgbModal,
    private addressConfirmationModal: NgbModal,
    private authenticationService: AuthenticationService) {
    this.paymentValidated = false;
    this.loadStripe();

  }

  ngOnInit(): void {
    // Choix de l'adresse
    this.cartService.cartUpdated.subscribe((cartUpdated: Cart) => {
      this.cartCurrent = cartUpdated;
      this.cartCurrent.total += +(this.SERVICE_CHARGE);
      if (this.cartCurrent.products.length < 1) {
        this.route.navigate(['home']);
      }
    });
    this.userService.getUserAddresses().subscribe((result) => {
      this.userAddresses = result.data[0].addresses;
      const modalRef = this.addressConfirmationModal.open(AddressModalComponent, {
        backdrop: 'static',
        keyboard: false,
      });
      modalRef.componentInstance.address = this.userAddresses[0];
      modalRef.result.then((res) => {
        const origin = `${this.cartCurrent.restaurant.street},
         ${this.cartCurrent.restaurant.city},
         ${this.cartCurrent.restaurant.zipcode}`
        ;
        const addressChoosen = `${res.street}, ${res.city}, ${res.zipcode}`;
        // send result google for calculate backend side
        const directionsService = new google.maps.DistanceMatrixService();
        directionsService.getDistanceMatrix({
          origins: [origin],
          destinations: [addressChoosen],
          travelMode: google.maps.TravelMode.DRIVING,
        }, (response, status) => {
          if (response.rows[0].elements[0].status === 'OK') {
            const responseDistance = response.rows[0].elements[0];
            this.cartService.getCostDelivery(responseDistance)
              .subscribe((resp) => {
                const pro = new Promise((resolve, rej) => {
                  this.cartService.setDeliveryCost(resp.deliveryInfos);
                  resolve('ok');
                });
                pro.then((respPro) => {
                  console.log(respPro);
                  this.cartService.cartUpdated.subscribe((cartUpdated: Cart) => {
                    this.cartCurrent = cartUpdated;
                    this.cartCurrent.total += +(this.SERVICE_CHARGE);
                    this.cartService.getTokenPaymentIntent(+(this.cartCurrent.total) * 100).subscribe((token: any ) => {
                        this.clientSecret = token.client_secret;
                        console.log(this.clientSecret);
                      }, (error) => {
                        if (/Expired JWT/.test(error)) {
                          this.route.navigate(['/login']);
                        }
                      }
                    );
                  });
                });
              });
            // stocker en db
            // calcule frais de livraison
            // calcule temps estimate en fonction du resto


          }
        });
      });
    });
  }


  private loadStripe(): void {
    if (window.document.getElementById('stripe-script')) {
      const child = window.document.getElementById('stripe-script');
      child.parentNode.removeChild(child);
    }

    const s = window.document.createElement('script');
    s.id = 'stripe-script';
    s.type = 'text/javascript';
    s.src = 'https://js.stripe.com/v3/';
    window.document.body.appendChild(s);
    const inter = setInterval(() => {
      if (typeof window['Stripe'] !== 'undefined') {
        this.loadStripeElements();
        clearInterval(inter);
      }
    }, 200);
  }


  private loadStripeElements(): void {
    this.stripe = window['Stripe']('pk_test_CF6ezfX4nzT8mkY4qO9QPIUB00TBXp24Zn');
    this.elementStripe = this.stripe.elements();
    const style = {
      base: {
        color: '#32325d',
        fontSize: '14px',
        ':focus': {
          borderColor: '#00969e',
        },
      }
    };
    this.cardNumber = this.elementStripe.create('cardNumber', {style: style});
    const cardExpiry = this.elementStripe.create('cardExpiry', {style: style});
    const cardCvc = this.elementStripe.create('cardCvc', {style: style});
    this.cardNumber.mount('#cardNumber');
    cardExpiry.mount('#cardExpiry');
    cardCvc.mount('#cardCvc');
  }


  onProceedCheckout(event: Event): void {
    event.preventDefault();
    this.stripe.confirmCardPayment(this.clientSecret, {
      payment_method: {
        card: this.cardNumber,
        billing_details: {
          name: 'Jenny Rosen' // TODO ADD REAL NAME
        }
      }
    }).then((result) => {
      if (result.error) {
        // Show error to your customer (e.g., insufficient funds)
        console.log(result.error.message);
      } else {
        // The payment has been processed!
        if (result.paymentIntent.status === 'succeeded') {
          const responsePayment = result.paymentIntent;
          if (responsePayment.status === 'succeeded') {
             // save order payment succeeded
             this.cartService.saveOrder({stripeResponse: responsePayment, cartDetail: this.cartCurrent })
               .subscribe((confCode: string) => {
                 const codeModal = this.codeConfirmationModal.open(ConfirmationCodePaymentModalComponent,
                   { backdrop: 'static', keyboard: false, size: 'lg' });
                 codeModal.componentInstance.code = confCode;
                 codeModal.result.then((response) => {
                   if (response) {
                     // send code to db
                     this.cartService.saveCodeCustomerToDeliver({ responseCustomer: response, cartDetail: this.cartCurrent})
                       .subscribe((responseServer) => {
                       });
                   }
                 });
               });
          }
        }
      }
    });
  }




  onSubmit(event: Event): void {
  }

}