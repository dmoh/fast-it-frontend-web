import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { SidenavService } from './sidenav-responsive/sidenav.service';
import { MediaQueryService } from './_services/media-query.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy{
  title = 'Fast Eat';

  private _mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;


  constructor( private mediaQueryService: MediaQueryService, changeDetectorRef: ChangeDetectorRef) {
      this._mobileQueryListener = () => changeDetectorRef.detectChanges();
      this.mediaQueryService.getMedia().addEventListener("change", this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener("change", this._mobileQueryListener);
  }
}
