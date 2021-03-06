import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeFeaturesComponent } from './home/home-features/home-features.component';
import { CardComponent } from './home/home-features/card/card.component';
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
import {RestaurantDashboardModule} from '@app/restaurants/restaurant-dashboard/restaurant-dashboard.module';
import { CustomerModule } from './customer/customer.module';
import {DeliveryModule} from '@app/delivery/delivery.module';
import { AdminModule } from './admin/admin.module';
import { Page404Component } from './page404/page404.component';
import { PasswordComponent } from './password/password.component';
import {RestaurantDashboardService} from '@app/restaurants/restaurant-dashboard/services/restaurant-dashboard.service';
import {SecurityRestaurantService} from '@app/_services/security-restaurant.service';
import { InfoModalComponent } from './info-modal/info-modal.component';
import { PickupOrderModalComponent } from './pickup-order-modal/pickup-order-modal.component';
import { SidenavService } from './sidenav-responsive/sidenav.service';
import { SidenavResponsiveComponent } from './sidenav-responsive/sidenav-responsive.component';
import { LegacyComponent } from './legacy/legacy.component';
import { TermsModalComponent } from './terms-modal/terms-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    HomeFeaturesComponent,
    CardComponent,
    RestaurantsCityComponent,
    LoginPageComponent,
    ProductModalComponent,
    ConfirmationCodePaymentModalComponent,
    LoginComponent,
    CheckoutComponent,
    Page404Component,
    PasswordComponent,
    InfoModalComponent,
    PickupOrderModalComponent,
    SidenavResponsiveComponent,
    LegacyComponent,
    TermsModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    CoreModule,
    RestaurantsModule,
    BrowserAnimationsModule,
    RestaurantDashboardModule,
    CustomerModule,
    DeliveryModule,
    AdminModule
  ],
  providers: [
    CityDataService,
    RestaurantDashboardService,
    SecurityRestaurantService,
    SidenavService,
  ],
  bootstrap: [AppComponent],
    exports: [
        CoreModule,
        HomeComponent,
        NavbarComponent,
        RestaurantsCityComponent,
        ProductModalComponent,
        ConfirmationCodePaymentModalComponent,
        CheckoutComponent,
        Page404Component,
        PasswordComponent,
        InfoModalComponent,
        LegacyComponent,
        TermsModalComponent
    ]
})
export class AppModule { }
