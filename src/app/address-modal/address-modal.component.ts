import {Component, Input, OnInit, Optional} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CustomerService} from "@app/customer/_services/customer.service";

@Component({
  selector: 'app-address-modal',
  templateUrl: './address-modal.component.html',
  styleUrls: ['./address-modal.component.scss']
})
export class AddressModalComponent implements OnInit {
  @Optional() address: any;
  addressForm: FormGroup;
  place: any;
  options;
  selectedAddress: any;
  addressByDefault: boolean;
  constructor(private fb: FormBuilder,
              private modal: NgbActiveModal,
              private customerService: CustomerService
  ) { }

  ngOnInit(): void {
    this.addressByDefault = true;
    this.options = {
      types: [],
      componentRestrictions: { country: 'FR' }
    };
    if (!this.address) {
      this.addressForm = this.fb.group({
        street: ['', [Validators.required, Validators.minLength(5)]],
        zipcode: ['', [Validators.required, Validators.minLength(5)]],
        city: ['', [Validators.required, Validators.minLength(2)]]
      });
    }
  }
  toggle() {
    this.addressByDefault = !this.addressByDefault;
  }

  onChooseAddress(type: string): void {
    if ('default' === type) {
      this.modal.close(this.address);
    }
  }

  onSubmit() {

  }

  handleAddressChange(event) {
    if (!!event.formatted_address) {
      this.selectedAddress = event;
    }
  }


  onSaveNewAddress() {
    if (this.selectedAddress) {
      this.customerService.addNewAddress(JSON.stringify(this.selectedAddress))
        .subscribe((res) => {
          console.warn(res);
        });
    }
  }
}
