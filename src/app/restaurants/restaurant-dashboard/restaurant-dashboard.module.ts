import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RestaurantDashboardRoutingModule } from './restaurant-dashboard-routing.module';
import { RestaurantDashboardComponent } from './restaurant-dashboard.component';
import { OrderComponent } from './order/order.component';
import { ProductComponent } from './product/product.component';
import { OverviewComponent } from './overview/overview.component';
import { CommerceComponent } from './commerce/commerce.component';
import {CoreModule} from '@app/core/core.module';
import { UpdateDialogComponent } from './product/update-dialog/update-dialog.component';
import {MatExpansionModule} from "@angular/material/expansion";
import {NgxMaterialTimepickerModule} from "ngx-material-timepicker";
import {MatRadioModule} from "@angular/material/radio";
import {MatListModule} from "@angular/material/list";


@NgModule({
  declarations: [
    RestaurantDashboardComponent,
    OrderComponent,
    ProductComponent,
    OverviewComponent,
    CommerceComponent,
    UpdateDialogComponent
  ],
    imports: [
        CommonModule,
        RestaurantDashboardRoutingModule,
        CoreModule,
        MatExpansionModule,
        NgxMaterialTimepickerModule,
        MatRadioModule,
        MatListModule
    ],
  exports: [
    RestaurantDashboardComponent,
    OrderComponent,
    ProductComponent,
    OverviewComponent,
    CommerceComponent,
    CoreModule,
    UpdateDialogComponent
  ]
})
export class RestaurantDashboardModule { }
