import { NgModule } from '@angular/core';
import { DeliveryRoutingModule } from './delivery-routing.module';
import {CoreModule} from "../core/core.module";
import { ParameterComponent } from './parameter/parameter.component';


@NgModule({
  declarations: [
      ParameterComponent,
  ],
  imports: [
    CoreModule,
    DeliveryRoutingModule
  ],
  exports: [
      CoreModule
  ]
})
export class DeliveryModule { }
