import {Directive, HostListener} from '@angular/core';
import {NavigationService} from "@app/_services/navigation.service";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Directive({
  selector: '[appBackButton]'
})
export class BackButtonDirective {

  constructor(
      private navigation: NavigationService,
      private modal: NgbModal
  ) {}


  @HostListener('click')
  onClick(): void {
    if (this.modal.hasOpenModals()) {
      this.modal.dismissAll();
    }
    this.navigation.back()
  }

}
