import {Component, Input, OnInit} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {map, startWith} from "rxjs/operators";
import {AdminService} from "@app/admin/admin.service";
import {Deliverer} from "@app/_models/deliverer";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-assigned-delivery-modal',
  templateUrl: './assigned-delivery-modal.component.html',
  styleUrls: ['./assigned-delivery-modal.component.scss']
})
export class AssignedDeliveryModalComponent implements OnInit {
  myControl: FormControl = new FormControl('', Validators.required);
  options: Deliverer[] = [];
  filteredOptions: Observable<Deliverer[]>;
  delivererSelected: any;

  @Input() orderDelivery: any;
  constructor(private adminService: AdminService,
              private modalActive: NgbActiveModal) { }

  ngOnInit(): void {
    this.adminService.getDelivererList()
      .subscribe((res) => {
        this.options = res.deliverers;
        this.filteredOptions = this.myControl.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filter(value))
          );
      });


  }

  private _filter(value: string): Deliverer[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.email.toLowerCase().includes(filterValue));
  }


  onValidate(): void {
    const email = this.myControl.value.trim();

    this.options.forEach((elem) => {
      if (email.toLowerCase() === elem.email.trim().toLowerCase()) {
        this.delivererSelected = elem;
      }
    });

    if (this.delivererSelected) {
      this.adminService
        .assignDelivery(
          this.delivererSelected.id,
          this.orderDelivery
        )
        .subscribe((res) => {
          if (res.ok) {
            this.modalActive.close('ok');
          }
        });
    }


  }

}
