import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {JwtInterceptor} from '@app/_helpers/jwt.interceptor';
import { Order } from '@app/_models/order';
import { Restaurant } from '@app/_models/restaurant';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RestaurantDashboardService } from '../restaurant-dashboard/services/restaurant-dashboard.service';
import {Product} from "@app/models/product";
import * as orderConst from '@app/_util/fasteat-constants';

@Component({
  selector: 'app-order-modal',
  templateUrl: './order-modal.component.html',
  styleUrls: ['./order-modal.component.scss']
})
export class OrderModalComponent implements OnInit {

  @Input() products: Product[];
  @Input() order: Order;
  @Input() business: Restaurant;
  @Input() additionalInfo: string;

  public productList: Product[] = [];
  public message = '';
  public isRejectionMessage = false;
  public orderConst = orderConst;
  public firstChoice = '15 - 30';
  public secondChoice = '30 - 45';
  public choiceFour   = '45 - 60';
  public choiceFive   = '60 - 75';
  public choiceSix   = '75 - 90';

  constructor(private route: ActivatedRoute,
              public modalActive: NgbActiveModal,
              private restaurantService: RestaurantDashboardService,
              // private jwtInterceptor: JwtInterceptor,
              private router: Router
              ) { }

  ngOnInit(): void {

    if (this.products) {
      this.products.forEach( myProduct => {
        let product: any;
        product = myProduct;
        this.restaurantService.getBusinessProductById(product.id).subscribe( prod => {
          product.infoComment = (prod as any).infoCommentCustomer;
          this.productList.push(product);
        });
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
    this.restaurantService.acceptOrder(dataOrder).subscribe((res) => {
      if (res.ok) {
        this.order.status = 2;
      }
    });
    // todo response-merchant
    this.restaurantService.saveResponseMerchant(dataOrder).subscribe();
    // this.redirectAfterTrait();
  }

  onRejectOrder(event: any) {
    this.isRejectionMessage = !this.isRejectionMessage;
  }

  onValidateRejectionMessage() {
    const message = this.message;
    const dataOrder: any = {
      order_id: this.order.id,
      order_accepted_by_merchant: false,
      business_id: this.business.id,
      status: 0,
      rejection_message: message,
    };
    this.restaurantService.refuseOrder(dataOrder).subscribe();
    this.redirectAfterTrait();
  }

  redirectAfterTrait() {
    this.router.navigate(['restaurant-dashboard', this.business.id, "orders" ]);
    this.modalActive.close();
  }


  onPrint() {
    window.print();
  }

}


