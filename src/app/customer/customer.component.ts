import {AfterViewInit, Component, EventEmitter, HostListener, OnInit, Output, ViewChild} from '@angular/core';
import {CustomerService} from '@app/customer/_services/customer.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {NotificationsComponent} from '@app/notifications/notifications.component';
import {User} from '@app/_models/user';
import { MediaQueryService } from '@app/_services/media-query.service';
import { MatSidenav } from '@angular/material/sidenav';
import { SidenavService } from '@app/sidenav-responsive/sidenav.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit, AfterViewInit {

  customer: User;
  notifications: any[];
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  isMedia: boolean;
  mobile: boolean;
  sideMode: string;

  @ViewChild('sidebarLeft')
  public sidenav: MatSidenav;

  constructor(
    private customerService: CustomerService,
    private snackBar: MatSnackBar,
    private bottomSheet: MatBottomSheet,
    private mediaQueryService: MediaQueryService,
    private sidenavService: SidenavService,
  ) { }

  @Output() sidenavChange = new EventEmitter<MatSidenav>();


  ngOnInit(): void {
    this.customerService.getInfosCustomer()
      .subscribe((response) => {
        this.customer = response;
        this.customerService.getNotificationsCustomerUnread()
          .subscribe((notif) => {
            this.notifications = notif;
          });
      });
    this.isMedia = this.mediaQueryService.getMobile();
  }

  onReadNotifications() {
    setTimeout(() => {
      this.customerService.sendNotificationsRead(this.notifications, {user: this.customer.id})
        .subscribe((res) => {
          this.notifications = [];
        });

    }, 1000);
  }

  ngAfterViewInit() {
    this.sidenavService.sideNavToggleSubject.subscribe(() => {
      return this.sidenav.toggle();
    });

    if (this.isMedia){
      this.sideMode = 'over';
      this.sidenav.close();
    } else {
      this.sideMode = 'side';
    }
  }

  openSnackBar() {
  }



}
