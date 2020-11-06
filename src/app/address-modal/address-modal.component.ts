import {Component, Input, OnInit, Optional} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CustomerService} from '@app/customer/_services/customer.service';

@Component({
  selector: 'app-address-modal',
  templateUrl: './address-modal.component.html',
  styleUrls: ['./address-modal.component.scss']
})
export class AddressModalComponent implements OnInit {
  @Optional() address: any;
  @Optional() showErrorAddress: boolean;
  addressForm: FormGroup;
  place: any;
  options;
  selectedAddress: any;
  addressByDefault: boolean;
  addressName: string = '';
  numNewAddress: string = '';
  zipcode: string = '';
  street: string = '';
  commentAddress: string = '';
  city: string = '';
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
        name: ['', [Validators.required, Validators.minLength(5)]],
        address: ['', [Validators.required, Validators.minLength(2)]]
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
      this.selectedAddress = event.formatted_address;
      this.street = event.formatted_address;
    }
  }





  onSaveNewAddress() {
    const newAddress = {
      street: this.street,
      num: this.numNewAddress,
      zipcode: this.zipcode,
      city: this.city,
      comment: this.commentAddress,
      name: this.addressName
    };
    this.customerService.addNewAddress(JSON.stringify(newAddress))
      .subscribe((res) => {
        if (res) {
          this.modal.close(newAddress);
        }
      });

  }
}
