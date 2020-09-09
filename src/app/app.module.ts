import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeFeaturesComponent } from './home/home-features/home-features.component';
import { CardComponent } from './home/home-features/card/card.component';
import { FooterComponent } from './footer/footer.component';
import {CoreModule} from './core/core.module';
import { RestaurantsCityComponent } from './restaurants-city/restaurants-city.component';
import {CityDataService} from './city-data.service';
import { LoginPageComponent } from './login-page/login-page.component';
import {RestaurantsModule} from './restaurants/restaurants.module';
import { ProductModalComponent } from './product-modal/product-modal.component';
import { ConfirmationCodePaymentModalComponent } from './confirmation-code-payment-modal/confirmation-code-payment-modal.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CheckoutComponent } from './checkout/checkout.component';
import {RestaurantDashboardModule} from "@app/restaurants/restaurant-dashboard/restaurant-dashboard.module";
import { DeliveryComponent } from './delivery/delivery.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    HomeFeaturesComponent,
    CardComponent,
    FooterComponent,
    RestaurantsCityComponent,
    LoginPageComponent,
    ProductModalComponent,
    ConfirmationCodePaymentModalComponent,
    LoginComponent,
    CheckoutComponent,
    DeliveryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    CoreModule,
    RestaurantsModule,
    BrowserAnimationsModule,
    RestaurantDashboardModule
  ],
  providers: [CityDataService],
  bootstrap: [AppComponent],
  exports: [
      CoreModule,
      HomeComponent,
      NavbarComponent,
      RestaurantsCityComponent,
      ProductModalComponent,
      ConfirmationCodePaymentModalComponent,
      CheckoutComponent
  ]
})
export class AppModule { }
