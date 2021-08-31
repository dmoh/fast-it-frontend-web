import { Component, OnInit } from '@angular/core';
import {Promotion} from "@app/_models/promotion";
import {AdminService} from "@app/admin/admin.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {UpdatePromotionModalComponent} from "@app/admin/promotion/update-promotion-modal/update-promotion-modal.component";
import {promotionApplicationTo} from "@app/_util/fasteat-constants";

@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.scss']
})
export class PromotionComponent implements OnInit {

  promotionApplicatedTo = promotionApplicationTo;
  promotions: Promotion[] = [];
  constructor(
      private adminService: AdminService,
      private modal: NgbModal
  ) { }

  ngOnInit(): void {
    this.getPromotions();
  }

  private getPromotions() {
    this.adminService.getPromotions()
        .subscribe((response) => {
          this.promotions = response.promotions;
        })
    ;
  }
  onAddPromotion(promotions) {
    this.openModalPromotion(promotions)
  }

  onUpdatePromotion(promotions: Promotion[], promotion: Promotion){
    this.openModalPromotion(promotions, promotion);
  }

  onArchivePromotion(promotionId: number) {
    if (confirm('Souhaitez-vous réellement supprimé cette promotion ?')) {
      this.adminService
          .archivePromotion(promotionId)
          .subscribe((res) => {
            if (res.ok){
              this.getPromotions();
            }
        });
    }
  }

  openModalPromotion(promotions, promotion?) {
    if (!promotion) {
      promotion = new Promotion();
    }
    const modalRef = this.modal.open(UpdatePromotionModalComponent);
    modalRef.componentInstance.promotion = promotion;
    modalRef.componentInstance.codesAlreadyExist = promotions;

    modalRef.result.then((res) => {
      if (res === 'ok') {
        this.getPromotions();
      }
    })
  }
}
