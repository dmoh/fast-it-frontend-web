import {AfterViewInit, Component, HostListener, OnInit} from '@angular/core';
import {CartService} from '../service/cart.service';
import { Router} from '@angular/router';
import {Cart} from '../model/cart';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConfirmationCodePaymentModalComponent} from '@app/confirmation-code-payment-modal/confirmation-code-payment-modal.component';
import {AuthenticationService} from '@app/_services/authentication.service';
import {ErrorInterceptor} from '@app/_helpers/error.interceptor';
import {UserService} from '@app/_services/user.service';
import {AddressModalComponent} from '@app/address-modal/address-modal.component';
import {ToastService} from "@app/_services/toast.service";
import {OrderModalComponent} from "@app/restaurants/order-modal/order-modal.component";
import {Product} from "@app/models/product";
import set = Reflect.set;
import {InfoModalComponent} from "@app/info-modal/info-modal.component";

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
  phoneCustomer: string;

  constructor(
    private cartService: CartService,
    private userService: UserService,
    private route: Router,
    private codeConfirmationModal: NgbModal,
    private infoModal: NgbModal,
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
      this.phoneCustomer = result.data[0].phone;
      this.userAddresses = result.data[0].addresses;
      const modalRef = this.addressConfirmationModal.open(AddressModalComponent, {
        backdrop: 'static',
        keyboard: false,
      });

      if (typeof this.userAddresses[0] === 'undefined') {
        modalRef.componentInstance.address = null;
      } else {
        modalRef.componentInstance.address = this.userAddresses[0];
      }
      modalRef.componentInstance.phoneCustomer = this.phoneCustomer;
      modalRef.result.then((res) => {
        const origin = `${this.cartCurrent.restaurant.street},
         ${this.cartCurrent.restaurant.city},
         ${this.cartCurrent.restaurant.zipcode}`
        ;
        // save phone user number
        this.userService.savePhoneNumber(res.phone)
          .subscribe((responseServer) => {
          });
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
            this.router.navigate(['cart-detail']);
            return;
          }
          if (response.rows[0].elements[0].status === 'OK') {
            const responseDistance = response.rows[0].elements[0];
            this.cartService.getCostDelivery(responseDistance)
              .subscribe((resp) => {
                setTimeout(() => {
                  this.showLoader = false;
                }, 1000);
                const pro = new Promise((resolve, rej) => {
                  this.cartService.setDeliveryCost(resp.deliveryInfos);
                  this.hasAddressSelected = true;
                  resolve('ok');
                });
                pro.then((respPro) => {
                  this.cartService.generateTotalCart(true);
                  this.cartService.cartUpdated.subscribe((cartUpdated: Cart) => {
                    this.cartCurrent = cartUpdated;
                  });
                });
              });
          }
        });
      });
    });
  }

  ngAfterViewInit() {
    this.loadStripe();
  }

  private loadStripe(): void {
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
  }


  onProceedCheckout(event: Event): void {
    this.showLoader = true;
    event.preventDefault();
    this.cartService.getTokenPaymentIntent(+(this.cartCurrent.total) * 100).subscribe((token: any ) => {
        this.clientSecret = token.client_secret;
        this.stripe.confirmCardPayment(this.clientSecret, {
          payment_method: {
            card: this.card,
            billing_details: {
              name: 'Customer' // TODO ADD REAL NAME
            }
          }
        }).then((result) => {
          if (result.error) {
            const modalRef = this.infoModal.open(InfoModalComponent, {
              backdrop: 'static',
              keyboard: false
            });
            modalRef.componentInstance.title = 'Erreur';
            modalRef.componentInstance.message = result.error.message;
            console.log(result.error.message);
          } else {
            this.showLoader = false;
            // The payment has been processed!
            const responsePayment = result.paymentIntent;
            if (responsePayment.status === 'succeeded') {
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
                            this.cartService.UpdateCart('empty-cart');
                            this.cartService.cartUpdated.subscribe((cartUpdated: Cart) => {
                              this.cartCurrent = cartUpdated;
                              this.router.navigate(['customer']);
                              this.cartService.emptyCart();
                            });
                          }
                        });
                    }
                  });
                });
              }
          }
        });
      }, (error) => {
        if (/Expired JWT/.test(error)) {
          this.route.navigate(['/login']);
        }
      }
    );

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


  onDeleteProduct(product: Product) {
    // tslint:disable-next-line:no-conditional-assignment
    if (this.cartCurrent.products.length <= 1) {
      this.cartService.emitCartSubject('empty');
    } else {
      this.cartService.UpdateCart('remove', product);
    }
  }


  onUpdateCart(type: string, product: Product) {
    if (type === 'less') {
      if (product.quantity > 1) {
        product.quantity--;
      }
    } else {
      product.quantity++;
    }
    this.cartService.UpdateCart('update', product);
  }


  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    if (this.addressConfirmationModal.hasOpenModals()) {
      this.addressConfirmationModal.dismissAll();
    }
  }
}
