import {Component, Input, OnInit, Optional} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-address-modal',
  templateUrl: './address-modal.component.html',
  styleUrls: ['./address-modal.component.scss']
})
export class AddressModalComponent implements OnInit {
  @Optional() address: any;
  addressForm: FormGroup;
  place: any;
  constructor(private fb: FormBuilder,
              private modal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    if (!this.address) {
      this.addressForm = this.fb.group({
        street: ['', [Validators.required, Validators.minLength(5)]],
        zipcode: ['', [Validators.required, Validators.minLength(5)]],
        city: ['', [Validators.required, Validators.minLength(2)]]
      });
    }
  }

  onChooseAddress(type: string): void {
    if ('default' === type) {
      this.modal.close(this.address);
    }
  }

}
