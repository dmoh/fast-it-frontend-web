import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {JwtInterceptor} from '@app/_helpers/jwt.interceptor';
import { Order } from '@app/_models/order';
import { Restaurant } from '@app/_models/restaurant';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RestaurantDashboardService } from '../restaurant-dashboard/services/restaurant-dashboard.service';

@Component({
  selector: 'app-order-modal',
  templateUrl: './order-modal.component.html',
  styleUrls: ['./order-modal.component.scss']
})
export class OrderModalComponent implements OnInit {

  @Input() products: any[];
  @Input() order: Order;
  @Input() business: Restaurant;
  @Input() additionalInfo: string;
  @Input() supplementProducts: string[];

  public orders: any[] = new Array();
  public message = '';

  constructor(private route: ActivatedRoute,
              public modalActive: NgbActiveModal,
              private restaurantService: RestaurantDashboardService,
              // private jwtInterceptor: JwtInterceptor,
              private router: Router
              ) { }

  ngOnInit(): void {

    if (this.products) {
      this.products.forEach( product => {
        const currentOrder: any = { };
        currentOrder.quantity = product.split(' ')[0];
        currentOrder.product = product.split(' ')[1];
        currentOrder.amount = this.order.amount;
        currentOrder.supplementProducts = this.supplementProducts;
        currentOrder.supplementProducts.push(this.order.addressToDeliver);
        this.orders.push(currentOrder);
      });
    }

  }

  onValidate(time: string) {
    // todo save commercant
    const dataOrder: any = {
      order_id: this.order.id,
      order_accepted_by_merchant: true,
      status: 3,
      business_id: this.business.id,
      time,
    };
    // todo accept Order
    this.restaurantService.acceptOrder(dataOrder).subscribe();
    // todo response-merchant
    this.restaurantService.saveResponseMerchant(dataOrder).subscribe();
    this.redirectAfterTrait();
  }

  onRefuseOrder(message: string) {
    // avertir client
    // pourquoi refus ??
    const dataOrder: any = {
      order_id: this.order.id,
      order_accepted_by_merchant: false,
      status: 9,
      business_id: null,
      message,
    };
    console.log('dataOrder', dataOrder);
    this.restaurantService.refuseOrder(dataOrder).subscribe();
    this.redirectAfterTrait();
  }

  redirectAfterTrait() {
    this.router.navigate(['restaurant-dashboard', this.business.id ], {
      queryParams: {
        orderId: +this.order.id,
        products: this.products.toString(),
      }
    });
    this.modalActive.close();
  }

}
