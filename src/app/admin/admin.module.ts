import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import {MatMenuModule} from "@angular/material/menu";
import { CommerceComponent } from './commerce/commerce.component';
import { UserComponent } from './user/user.component';
import { EditCommerceComponent } from './commerce/edit-commerce/edit-commerce.component';
import {CoreModule} from "@app/core/core.module";
import { DeliveriesComponent } from './deliveries/deliveries.component';
import { AssignDeliverisComponent } from './assign-deliveris/assign-deliveris.component';
import { AssignedDeliveryModalComponent } from './assigned-delivery-modal/assigned-delivery-modal.component';
import { FirstPageComponent } from './first-page/first-page.component';
import { AlertManagerComponent } from './first-page/alert-manager/alert-manager.component';
import { ModalUserComponent } from './modal-user/modal-user.component';
import { CategoryComponent } from './category/category.component';
import { CategoryModalComponent } from './category-modal/category-modal.component';
import { SectorComponent } from './sector/sector.component';
import { SectorModalComponent } from './sector-modal/sector-modal.component';
import { OrderManagerComponent } from './order-manager/order-manager.component';
import { PromotionComponent } from './promotion/promotion.component';
import { UpdatePromotionModalComponent } from './promotion/update-promotion-modal/update-promotion-modal.component';
import { TrackingComponent } from './tracking/tracking.component';
import { SubscriptionStatsComponent } from './stats/subscription-stats/subscription-stats.component';


@NgModule({
  declarations: [AdminComponent, CommerceComponent, UserComponent, EditCommerceComponent, DeliveriesComponent, AssignDeliverisComponent, AssignedDeliveryModalComponent, FirstPageComponent, AlertManagerComponent, ModalUserComponent, CategoryComponent, CategoryModalComponent, SectorComponent, SectorModalComponent, OrderManagerComponent, PromotionComponent, UpdatePromotionModalComponent, TrackingComponent, SubscriptionStatsComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    CoreModule,
    MatMenuModule,
  ],
  exports: [AdminComponent, EditCommerceComponent, DeliveriesComponent, AssignDeliverisComponent, AssignedDeliveryModalComponent, FirstPageComponent, AlertManagerComponent, ModalUserComponent, CategoryComponent, CategoryModalComponent, SectorComponent, SectorModalComponent, OrderManagerComponent, PromotionComponent, UpdatePromotionModalComponent, TrackingComponent, SubscriptionStatsComponent]
})
export class AdminModule { }
