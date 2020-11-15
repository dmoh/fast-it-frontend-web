import { Injectable, EventEmitter} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SidenavService {
    private sidenav: MatSidenav;
    public sideNavToggleSubject: BehaviorSubject<any> = new BehaviorSubject(null);
    

    public setSidenav(sidenav: MatSidenav) {
        console.log("sidenav compo", sidenav);
        this.sidenav = sidenav;
    }

    public open() {
        return this.sidenav.open();
    }


    public close() {
        return this.sidenav.close();
    }

    public toggleBis(): void {
        if (this.sidenav) {
            this.sidenav.toggle();
        }
    }

    public toggle() {
        console.log(this.sideNavToggleSubject);
        return this.sideNavToggleSubject.next(null);
    } 
}