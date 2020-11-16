import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { SidenavService } from '@app/sidenav-responsive/sidenav.service';
import {User} from "@app/_models/user";
import {AuthenticationService} from "@app/_services/authentication.service";
import { MediaQueryService } from '@app/_services/media-query.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, AfterViewInit {

  isMedia: boolean;

  @ViewChild('sidebarLeft') 
  public sidenav: MatSidenav;
  customer: User;
  notifications: any[];
  constructor(private authenticationService: AuthenticationService,
    private mediaQueryService: MediaQueryService,
    private sidenavService: SidenavService) { }

  ngOnInit(): void {
    this.authenticationService.checkIsAdmin()
      .subscribe((response) => {
        console.log(response);
      });

      this.isMedia = this.mediaQueryService.getMobile(); 
  }
  
  @HostListener('window:resize', [])
  onResize() {
    this.isMedia = this.mediaQueryService.getMobile();
    if (!this.isMedia) {
      this.sidenav.open();
    }
  }

  onReadNotifications() {

  }

  ngAfterViewInit() { 
    this.sidenavService.sideNavToggleSubject.subscribe(()=> {
       return this.sidenav.toggle();
     });
    if (this.isMedia) {
      this.sidenav.close();
    }
  } 

}
