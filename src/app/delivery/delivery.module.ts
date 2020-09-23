import { NgModule } from '@angular/core';
import { DeliveryRoutingModule } from './delivery-routing.module';
import {CoreModule} from "../core/core.module";
import { DeliveryComponent } from './delivery.component';
import { ParameterComponent } from './parameter/parameter.component';
import {AwaitingDeliveryComponent} from "@app/delivery/awaiting-delivery/awaiting-delivery.component";
import {MyDeliveryComponent} from "@app/delivery/my-delivery/my-delivery.component";


@NgModule({
  declarations: [
      DeliveryComponent,
      ParameterComponent,
      AwaitingDeliveryComponent,
      MyDeliveryComponent
  ],
  imports: [
    CoreModule,
    DeliveryRoutingModule
  ],
  exports: [
      CoreModule,
      DeliveryComponent,
      ParameterComponent,
      AwaitingDeliveryComponent,
      MyDeliveryComponent
  ]
})
export class DeliveryModule { }
