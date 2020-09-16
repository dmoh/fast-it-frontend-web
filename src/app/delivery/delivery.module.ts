import { NgModule } from '@angular/core';
import { DeliveryRoutingModule } from './delivery-routing.module';
import {CoreModule} from "../core/core.module";
import { DeliveryComponent } from './delivery.component';
import { ParameterComponent } from './parameter/parameter.component';


@NgModule({
  declarations: [
      ParameterComponent,
  ],
  imports: [
    CoreModule,
    DeliveryRoutingModule
  ],
  // entryComponents: [
  //     NavbarComponent,
  //     ProductModalComponent,
  //     CartComponent
  // ],
  exports: [
      CoreModule
  ]
})
export class DeliveryModule { }
