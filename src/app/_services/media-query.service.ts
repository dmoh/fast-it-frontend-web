import { ChangeDetectorRef, Injectable } from '@angular/core';
// import { MediaMatcher } from '@angular/cdk/layout';

@Injectable({
  providedIn: 'root'
})

export class MediaQueryService {

  private _mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;

  constructor(// media: MediaMatcher
  ) {
      this.mobileQuery = window.matchMedia('(max-width: 600px)');
      // this._mobileQueryListener = () => changeDetectorRef.detectChanges();
      // this.mobileQuery.addEventListener("change", this._mobileQueryListener);
  }

  getMedia(): MediaQueryList {
    return this.mobileQuery;
  }

  setMediaQuerieListener(value): () => void {
    this._mobileQueryListener = value;
    return this._mobileQueryListener;
  }

}
