import {Component, Input, OnInit} from '@angular/core';
import {Promotion} from "@app/_models/promotion";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {promotionApplicationTo} from "@app/_util/fasteat-constants";
import {AdminService} from "@app/admin/admin.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-update-promotion-modal',
  templateUrl: './update-promotion-modal.component.html',
  styleUrls: ['./update-promotion-modal.component.scss']
})
export class UpdatePromotionModalComponent implements OnInit {

  submitted: boolean = false;
  promotionForm: FormGroup;
  applicationTo = promotionApplicationTo;
  errorDate: boolean = false;
  sectors = new FormControl();
  sectorList = [];
  client = new FormControl();
  restaurant = new FormControl();
  restaurantsFound = [];
  clientsFound = [];
  @Input() promotion: Promotion;
  @Input() codesAlreadyExist: any[] = [];
  restaurantsSelected = new FormControl();
  clientsSelected = new FormControl();
    errorAlreadyExist: {ok, message} = {ok: false, message: 'Ce code existe déjà'};
  constructor(
      private fb: FormBuilder,
      private adminService: AdminService,
      private modal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.promotionForm = this.fb.group({
      code: [this.promotion.code, [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(new RegExp("[0-9A-Z]{8,15}"))
      ]],
      percentage: [this.promotion.percentage, [Validators.required, Validators.pattern(new RegExp("[0-9,. ]*"))]],
      enable: [this.promotion.enable],
      applicatedTo: [this.promotion.applicatedTo, Validators.required],
      dateBegin: [this.promotion.dateBegin, Validators.required],
      dateEnd: [this.promotion.dateEnd, Validators.required]
    });
    this.getSectors();
    this.promotionForm.get('code').valueChanges
        .subscribe((code) => {
            const search = obj => obj.code.trim().toUpperCase() === code.trim().toUpperCase();
            const index = this.codesAlreadyExist.findIndex(search);
           if (index !== -1) {
               this.errorAlreadyExist.ok = true;
               this.errorAlreadyExist.message = 'Ce code existe déjà';
           } else {
               this.errorAlreadyExist.ok = false;
               this.errorAlreadyExist.message = '';
           }
        })
        ;
  }

  getSectors(){
    this.adminService.getSectorList()
        .subscribe((response) => {
          this.sectorList = response.sectors;
        })
  }

  get f() {
    console.warn('fsds', this.promotionForm.controls);
    return this.promotionForm.controls;
  }
  onSubmit() {
    if (confirm('En êtes-vous sûre de créer ce code promo ? ')) {
        this.submitted = true;
        this.promotion = Object.assign(this.promotion, this.promotionForm.value);
        this.promotion.sectors = this.sectors.value;
        this.promotion.restaurants = this.restaurantsSelected.value;
        this.promotion.clients = this.clientsSelected.value;
        this.adminService
            .updatePromotion(this.promotion)
            .subscribe((response) => {
                if (response.ok) {
                    this.modal.close('ok');
                }
            })
        ;
    }
  }

  onFind(type: string) {
    switch (type) {
      case 'restaurant':
        this.adminService.getBusinessByName(this.restaurant.value)
            .subscribe((response) => {
              this.restaurantsFound = response.restaurants;
            });
          break;
      case 'client':
        this.adminService.findUserByEmail(this.client.value)
            .subscribe((response) => {
              this.clientsFound = [];
              this.clientsFound= response.users;
            });
          break;


    }
  }


    onValidateChoice(type: string){
        switch (type) {
            case 'restaurant':
                console.warn('res', this.restaurantsSelected.value);
                this.promotion.restaurants = this.restaurantsSelected.value;
                console.warn('promo', this.promotion);

                /*this.adminService.getBusinessByName(this.restaurant.value)
                    .subscribe((response) => {
                        this.restaurantsFound = response.restaurants;
                    });*/
                break;
            case 'sector':
                console.warn('sector', this.sectors.value);
                this.promotion.sectors = this.sectors.value;
                console.warn('promo', this.promotion);

                /*this.adminService.getBusinessByName(this.restaurant.value)
                    .subscribe((response) => {
                        this.restaurantsFound = response.restaurants;
                    });*/
                break;
            case 'client':
                console.warn('client', this.clientsSelected.value);
                this.promotion.clients = this.clientsSelected.value;
                console.warn('promo', this.promotion);

                /*this.adminService.getBusinessByName(this.restaurant.value)
                    .subscribe((response) => {
                        this.restaurantsFound = response.restaurants;
                    });*/
                break;
        }
    }
}
