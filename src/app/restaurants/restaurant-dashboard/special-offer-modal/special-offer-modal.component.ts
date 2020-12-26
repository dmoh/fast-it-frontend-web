import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SpecialOffer} from "@app/_models/special-offer";
import {RestaurantDashboardService} from "@app/restaurants/restaurant-dashboard/services/restaurant-dashboard.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-special-offer-modal',
  templateUrl: './special-offer-modal.component.html',
  styleUrls: ['./special-offer-modal.component.scss']
})
export class SpecialOfferModalComponent implements OnInit {

  specialOffer: SpecialOffer = new SpecialOffer();
  specialOfferForm: FormGroup;
  @Input() restaurantId: number;
  constructor(private modalAcitve: NgbActiveModal,
              private fb: FormBuilder, private restaurantDashboardService: RestaurantDashboardService) { }

  ngOnInit(): void {
    this.specialOfferForm = this.fb.group(
      {
        title: [this.specialOffer.title, [Validators.required, Validators.minLength(5)]],
        isActive: this.specialOffer.isActive,
        promotionalCode: this.specialOffer.promotionalCode,
        specialOfferAmount: [this.specialOffer.specialOfferAmount, Validators.pattern('')],
        minimumAmountForOffer: this.specialOffer.minimumAmountForOffer
      }
    );
  }

  onSubmit() {
    this.specialOffer = Object.assign(this.specialOffer, this.specialOfferForm.value);
    if (this.specialOffer.id === 0) {
      this.specialOffer.restaurantId = this.restaurantId;
    }

    this.restaurantDashboardService
      .updateSpecialOfferByBusinessId(this.specialOffer.restaurantId, this.specialOffer)
      .subscribe((res) => {
        if (res.ok) {
          this.modalAcitve.close('ok');
        }
      });
    console.warn(this.specialOffer);
  }

}
