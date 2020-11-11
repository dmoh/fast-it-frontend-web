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
  @Input() supplementsProduct: any[];

  public orders: any[] = new Array();
  public message = '';

  public firstChoice = "15 - 30";
  public secondChoice = "30 - 45";
  public thirdChoice = "+45";

  constructor(private route: ActivatedRoute,
              public modalActive: NgbActiveModal,
              private restaurantService: RestaurantDashboardService,
              // private jwtInterceptor: JwtInterceptor,
              private router: Router
              ) { }

  ngOnInit(): void {

    if (this.products) {
      this.products.forEach( product => {
        const order: any = { };
        order.quantity = product.split(' ')[0];
        order.product = product.split(' ')[1];
        order.amount = this.order.amount;
        
        order.supplementProducts = this.supplementsProduct
        .filter( suppProduct => suppProduct.productId != product.id );

        console.log("supplement", order.supplementProducts);
        
        this.orders.push(order);
      });
    }

  }

  onValidate(time: string) {
    // todo save commercant
    const dataOrder: any = {
      order_id: this.order.id,
      order_accepted_by_merchant: true,
      status: 2,
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
      status: 0,
      business_id: null,
      message,
    };
    console.log('dataOrder', dataOrder);
    this.restaurantService.refuseOrder(dataOrder).subscribe();
    this.redirectAfterTrait();
  }

  redirectAfterTrait() {
    this.router.navigate(['restaurant-dashboard', this.business.id ], {
      // queryParams: {
      //   orderId: +this.order.id,
      //   products: this.products.toString(),
      // }
    });
    this.modalActive.close();
  }

}
