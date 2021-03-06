import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { CartModule } from '../cart/cart.module';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatChipsModule} from '@angular/material/chips';
import {MatStepperModule} from '@angular/material/stepper';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatTableModule} from '@angular/material/table';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTabsModule} from '@angular/material/tabs';
import {ErrorInterceptor} from '@app/_helpers/error.interceptor';
import {JwtInterceptor} from '@app/_helpers/jwt.interceptor';
import { AddressModalComponent } from '../address-modal/address-modal.component';
import { GoogleMapsModule } from '@angular/google-maps';
import {MatSelectModule} from '@angular/material/select';
import {MatBadgeModule} from '@angular/material/badge';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatBottomSheet, MatBottomSheetModule} from '@angular/material/bottom-sheet';
import { NotificationsComponent } from '../notifications/notifications.component';
import {MatRadioModule} from '@angular/material/radio';
import {FooterComponent} from '@app/footer/footer.component';
import { CategoryProductComponent } from '../restaurants/restaurant-dashboard/category-product/category-product.component';
import { AddProductDialogComponent } from '../restaurants/restaurant-dashboard/category-product/add-product-dialog/add-product-dialog.component';
import {MatListModule} from '@angular/material/list';
import { ToastComponent } from '../toast/toast.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { MaterialLibModule } from '@app/sidenav-responsive/material-lib.module';
import {MatToolbarModule} from '@angular/material/toolbar';
import { HeaderSpecificComponent } from '../header-specific/header-specific.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSortModule} from "@angular/material/sort";
import { TipModalComponent } from '../tip-modal/tip-modal.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';


@NgModule({
  declarations: [
    AddressModalComponent,
    NotificationsComponent,
    FooterComponent,
    CategoryProductComponent,
    AddProductDialogComponent,
    ToastComponent,
    HeaderSpecificComponent,
    TipModalComponent
  ],
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        RouterModule,
        GooglePlaceModule,
        CartModule,
        MatFormFieldModule,
        MatIconModule,
        MatAutocompleteModule,
        MatInputModule,
        MatCardModule,
        MatDialogModule,
        MatProgressBarModule,
        MatTableModule,
        MatChipsModule,
        MatStepperModule,
        MatSlideToggleModule,
        MatButtonModule,
        MatTabsModule,
        GoogleMapsModule,
        MatSelectModule,
        MatBadgeModule,
        MatSnackBarModule,
        MatBottomSheetModule,
        MatRadioModule,
        MatListModule,
        DragDropModule,
        MaterialLibModule,
        NgbModule,
        MatToolbarModule,
        MatMenuModule,
        MatSidenavModule,
        MatSortModule
    ],
  exports: [
      CommonModule,
      FormsModule,
      HttpClientModule,
      ReactiveFormsModule,
      RouterModule,
      GooglePlaceModule,
      CartModule,
      MatIconModule,
      MatAutocompleteModule,
      MatInputModule,
      MatCardModule,
      MatDialogModule,
      MatProgressBarModule,
      MatTableModule,
      MatFormFieldModule,
      MatChipsModule,
      MatStepperModule,
      MatSlideToggleModule,
      MatButtonModule,
      MatTabsModule,
      AddressModalComponent,
      GoogleMapsModule,
      MatSelectModule,
      MatBadgeModule,
      MatSnackBarModule,
      MatBottomSheetModule,
      NotificationsComponent,
      FooterComponent,
      CategoryProductComponent,
      AddProductDialogComponent,
      ToastComponent,
      DragDropModule,
      MaterialLibModule,
      MatToolbarModule,
      HeaderSpecificComponent,
      MatMenuModule,
      MatSidenavModule,
      MatSortModule,
      TipModalComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
    MatDialog, MatBottomSheet
  ],
  entryComponents: [
    NotificationsComponent,
    FooterComponent
  ]
})
export class CoreModule { }
