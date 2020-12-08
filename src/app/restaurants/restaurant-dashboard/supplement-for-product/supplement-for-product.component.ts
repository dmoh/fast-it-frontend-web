import {Component, Input, OnInit} from '@angular/core';
import {Supplement} from "@app/_models/supplement";
import {RestaurantDashboardService} from "@app/restaurants/restaurant-dashboard/services/restaurant-dashboard.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-supplement-for-product',
  templateUrl: './supplement-for-product.component.html',
  styleUrls: ['./supplement-for-product.component.scss']
})
export class SupplementForProductComponent implements OnInit {

  @Input() restaurantId: number;
  @Input() supplement: Supplement;
  constructor(private restaurantDashboardService: RestaurantDashboardService,
              public modalActive: NgbActiveModal) { }

  ngOnInit(): void {
    /*this.restaurantDashboardService
      .getSupplementByBusinessId(this.restaurantId)
      .subscribe((res) => {
        if (res.ok){
          this.supplement = res.supplement;
        }
      });*/
  }

  onSubmit(): void {
    this.restaurantDashboardService
      .updateSupplementByBusinessId(this.restaurantId, this.supplement)
      .subscribe((response) => {
        if (response.ok) {
          this.modalActive.close('ok');
        }
      });
  }

}
