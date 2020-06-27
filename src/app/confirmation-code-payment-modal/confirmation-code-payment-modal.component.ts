import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-confirmation-code-payment-modal',
  templateUrl: './confirmation-code-payment-modal.component.html',
  styleUrls: ['./confirmation-code-payment-modal.component.scss']
})
export class ConfirmationCodePaymentModalComponent implements OnInit {

  @Input() code: string;
  constructor(private modal: NgbActiveModal) { }

  ngOnInit(): void {
  }


  onValidatedInformation(): void {
    // todo send to server with id customer
    this.modal.close({
      code: this.code,
      customerIsAgree: true
    });
  }

}
