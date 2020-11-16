import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MediaQueryService } from './_services/media-query.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Fast It';
  screenSize = 992;

  constructor( private mediaQueryService: MediaQueryService) {
    const width = window.innerWidth;
    this.mediaQueryService.setMobile(width < this.screenSize);
  }

  @HostListener('window:resize', [])
  onResize() {
    const width = window.innerWidth;
    this.mediaQueryService.setMobile(width < this.screenSize);
    // console.log(width < this.screenSize);
  }
}
