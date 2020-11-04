import {AfterViewInit, Component, OnInit} from '@angular/core';
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
import {ToastService} from "@app/_services/toast.service";
import {OrderModalComponent} from "@app/restaurants/order-modal/order-modal.component";

@Component({
  selector: 'app-cart-detail',
  templateUrl: './cart-detail.component.html',
  styleUrls: ['./cart-detail.component.scss']
})
export class CartDetailComponent implements OnInit, AfterViewInit {
  stripe: any;
  elementStripe: any;
  cardNumber: any;
  card: any;
  cartCurrent: Cart;
  userAddresses: any[] = [];
  clientSecret: string;
  // todo declare constante frais de service
  paymentValidated: boolean;
  canBeDeliver: boolean = false;
  hasAddressSelected: boolean = false;
  showLoader: boolean;
  addressChose: any;


  constructor(
    private cartService: CartService,
    private userService: UserService,
    private route: Router,
    private codeConfirmationModal: NgbModal,
    private addressConfirmationModal: NgbModal,
    private authenticationService: AuthenticationService,
    private router: Router,
    private toastService: ToastService,
  ) {
    this.showLoader = true;
    this.paymentValidated = false;
  }

  ngOnInit(): void {
    // Choix de l'adresse
    this.cartService.cartUpdated.subscribe((cartUpdated: Cart) => {
      this.cartCurrent = cartUpdated;
      if (this.cartCurrent.products.length < 1) {
        this.route.navigate(['home']);
      }

    });
    this.userService.getUserAddresses().subscribe((result) => {
      this.showLoader = false;
      this.userAddresses = result.data[0].addresses;
      const modalRef = this.addressConfirmationModal.open(AddressModalComponent, {
        backdrop: 'static',
        keyboard: false,
      });
      modalRef.componentInstance.address = this.userAddresses[0];
      modalRef.result.then((res) => {
        this.showLoader = true;
        const origin = `${this.cartCurrent.restaurant.street},
         ${this.cartCurrent.restaurant.city},
         ${this.cartCurrent.restaurant.zipcode}`
        ;
        this.addressChose = res;
        const addressChoosen = `${res.street}, ${res.city}, ${res.zipcode}`;
        // send result google for calculate backend side
        const directionsService = new google.maps.DistanceMatrixService();
        directionsService.getDistanceMatrix({
          origins: [origin],
          destinations: [addressChoosen],
          travelMode: google.maps.TravelMode.DRIVING,
        }, (response, status) => {
          if (response.rows === null) {
            this.showLoader = false;
            this.router.navigate(['cart-detail']);
            return;
          }
          if (response.rows[0].elements[0].status === 'OK') {
            const responseDistance = response.rows[0].elements[0];
            this.cartService.getCostDelivery(responseDistance)
              .subscribe((resp) => {
                const pro = new Promise((resolve, rej) => {
                  this.cartService.setDeliveryCost(resp.deliveryInfos);
                  this.hasAddressSelected = true;
                  resolve('ok');
                });
                pro.then((respPro) => {
                  this.cartService.cartUpdated.subscribe((cartUpdated: Cart) => {
                    this.cartCurrent = cartUpdated;
                    this.cartService.getTokenPaymentIntent(+(this.cartCurrent.total) * 100).subscribe((token: any ) => {
                        this.clientSecret = token.client_secret;
                        this.showLoader = false;
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

  ngAfterViewInit() {
    this.loadStripe();
  }

  private loadStripe(): void {
    /*if (window.document.getElementById('stripe-script')) {
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
    }, 200);*/
    this.loadStripeElements();
  }


  private loadStripeElements(): void {
    this.stripe = window['Stripe']('pk_test_CF6ezfX4nzT8mkY4qO9QPIUB00TBXp24Zn');
    this.elementStripe = this.stripe.elements();
    const style = {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    };
    // this.cardNumber = this.elementStripe.create('card', {style: style});
    this.card = this.elementStripe.create('card', { style: style });
    this.card.mount('#card-element');
    // Add an instance of the card Element into the `card-element` <div>.
    this.card.mount('#card-element');

// Handle real-time validation errors from the card Element.
    this.card.on('change', (event) => {
      const  displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });

    /*const cardExpiry = this.elementStripe.create('cardExpiry', {style: style});
    const cardCvc = this.elementStripe.create('cardCvc', {style: style});
    this.cardNumber.mount('#cardNumber');
    cardExpiry.mount('#cardExpiry');
    cardCvc.mount('#cardCvc');*/
  }


  onProceedCheckout(event: Event): void {
    event.preventDefault();
    this.stripe.confirmCardPayment(this.clientSecret, {
      payment_method: {
        card: this.card,
        billing_details: {
          name: 'Customer' // TODO ADD REAL NAME
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
              /*this.toastService.show('Paiement accepté', {
                classname: 'bg-success text-light',
                delay: 4000,
                autohide: true,
                headertext: 'Votre commande est en cours de validation'
              });*/
             // save order payment succeeded
             this.cartService.saveOrder({stripeResponse: responsePayment, cartDetail: this.cartCurrent })
               .subscribe((confCode) => {
                 const codeModal = this.codeConfirmationModal.open(ConfirmationCodePaymentModalComponent,
                   { backdrop: 'static', keyboard: false, size: 'lg' });
                 codeModal.componentInstance.infos = confCode;
                 codeModal.result.then((response) => {
                   if (response) {
                     // send code to db
                     this.cartService.saveCodeCustomerToDeliver({ responseCustomer: response})
                       .subscribe((responseServer) => {
                         if (responseServer.ok) {
                           this.cartCurrent.isValidate = true;
                           this.cartService.UpdateCart('empty-cart');
                           this.cartService.cartUpdated.subscribe((cartUpdated: Cart) => {
                             this.cartCurrent = cartUpdated;
                             this.router.navigate(['customer']);
                           });
                         }
                     });
                   }
                 });
               });
          }
        }
      }
    });
  }


  onShowModalOrder() {
    const modalRef = this.addressConfirmationModal.open(OrderModalComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg'
    });
  }


  onSubmit(event: Event): void {
  }

}
