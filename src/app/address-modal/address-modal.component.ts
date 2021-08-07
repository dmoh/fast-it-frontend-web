import {Component, Input, OnInit, Optional} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
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
  @Optional() phoneCustomer: string;
  @Optional() nameCustomer: string;
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
  isDefaultAddress: boolean;
  hasValidNumberPhone: string;
  phoneCustomerCurrent: FormControl;
  nameCustomerCurrent: FormControl;

  getErrorPhoneMessage() {
    if (this.phoneCustomerCurrent.hasError('required')) {
      return 'Numèro de téléphone obligatoire';
    }
    return this.phoneCustomerCurrent.hasError('pattern') ? 'Numéro de téléphone incorrect' : '';
  }

  getErrorNameMessage() {
    if (this.nameCustomerCurrent.hasError('required')) {
      return 'Nom obligatoire';
    }
    return this.nameCustomerCurrent.hasError('pattern') ? 'Un/des caractère(s) non autorisé(s)    ' : '';
  }
  constructor(private fb: FormBuilder,
              private modal: NgbActiveModal,
              private customerService: CustomerService
  ) {


  }

  ngOnInit(): void {
    this.phoneCustomerCurrent = new FormControl(this.phoneCustomer, [
      Validators.required, Validators.pattern(/^(\+)?[0-9]{10,}$/)
    ]);
    this.nameCustomerCurrent = new FormControl(this.nameCustomer, [
      Validators.required, Validators.pattern(/^[a-zA-Z\-'çïéüèê ]{2,}$/)
    ]);
    this.options = {
      types: [],
      componentRestrictions: { country: 'FR' }
    };
    if (!this.address) {
      this.isDefaultAddress = true;
      this.addressByDefault = false;
      this.isDefaultAddress = true;
      this.addressForm = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(5)]],
        address: ['', [Validators.required, Validators.minLength(2)]]
      });
    }
  }
  toggle() {
    if (this.address === null) {
      return;
    }
    this.addressByDefault = !this.addressByDefault;
  }

  onChooseAddress(type: string): void {
    if ('default' === type) {
      this.address.phone = this.phoneCustomer;
      this.address.name = this.nameCustomerCurrent.value;
      this.modal.close(this.address);
    }
  }

  onSubmit() {}

  handleAddressChange(event) {
    if (!!event.formatted_address) {
      this.selectedAddress = event.formatted_address;
      this.street = event.formatted_address;
    }
  }

  onSaveNewAddress() {
    const newAddress = {
      street: this.street,
      zipcode: this.zipcode,
      city: this.city,
      comment: this.commentAddress,
      name: this.nameCustomerCurrent.value,
      phone: this.phoneCustomerCurrent.value
    };
    this.customerService.addNewAddress(JSON.stringify(newAddress))
      .subscribe((res) => {
        if (res) {
          this.modal.close(newAddress);
        }
      });
  }
}
