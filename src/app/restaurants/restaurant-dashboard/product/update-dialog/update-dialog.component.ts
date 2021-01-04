import {Component, Inject, OnInit, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {RestaurantDashboardService} from '@app/restaurants/restaurant-dashboard/services/restaurant-dashboard.service';
import {Product} from '@app/models/product';
import {FormControl} from "@angular/forms";
import {ListSupplements} from "@app/_models/list-supplements";
import {Supplement} from "@app/_models/supplement";

@Component({
  selector: 'app-update-dialog',
  templateUrl: './update-dialog.component.html',
  styleUrls: ['./update-dialog.component.scss']
})
export class UpdateDialogComponent implements OnInit {

  photo: any;
  categories: any[] = [];
  listSupps: ListSupplements[] = [];
  listSelectedId: number;
  supSelectedId: number;
  listAlreadyExists: ListSupplements[] = [];
  suppAlreadyExists: Supplement[] = [];
  suppAvailable: Supplement[] = [];
  supps = new FormControl();
  @Optional() restaurantId: number;
  constructor(
    private restaurantDashboardService: RestaurantDashboardService,
    public dialogRef: MatDialogRef<UpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public product: Product
  ) {}

  ngOnInit(): void {
    if (this.product.amount && +(this.product.amount) > 0) {
      this.product.amount = +(this.product.amount) / 100;
    }
    this.restaurantDashboardService
      .getCategoriesByBusinessId(this.product.business_id)
      .subscribe((cats) => {
        this.categories = cats;
      });
    this.getListSupp(this.product.business_id);
  }
  onNoClick(): void {
    this.dialogRef.close('no-update');
  }

  onSaveProduct(product: any): void {
    if (this.product.id !== 0) {
      if (typeof this.suppAlreadyExists)
      this.product.hasListOrSupplement =
        !(typeof this.suppAlreadyExists !== 'undefined'
          && typeof this.listAlreadyExists !== 'undefined' &&
          this.suppAlreadyExists.length === 0
          && this.listAlreadyExists.length === 0
      );
      this.restaurantDashboardService
        .updateListSupplementByProductIdAndBusinessId(
          this.product.business_id, this.product.id, this.listAlreadyExists
        )
        .subscribe((response) => {
          this.restaurantDashboardService
            .updateSupplementByProductIdBusinessId(this.product.business_id, this.product.id, this.suppAlreadyExists)
            .subscribe((res) => {
              this.dialogRef.close(this.product);
            });
        });
    } else {
      this.dialogRef.close(this.product);
    }
  }

  onChange(event) {
  }

  onChangeAmount() {
    // display prix affiché
    if (this.product.amount > 10 ) {
    }
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      this.product.photo = event.target.files[0];
    }
  }

  onChangeCategoryProduct(event) {
  }

  private getListSupp(restaurantId) {
    this.restaurantDashboardService.getListSupplementByBusinessId(restaurantId)
      .subscribe((resList) => {
        if (resList.ok) {
          this.listSupps = resList.lists;
        }
      });

    this.restaurantDashboardService.getSupplementByBusinessId(restaurantId)
      .subscribe((resList) => {
        if (resList.ok) {
          this.suppAvailable = resList.supplements;
        }
      });
    if (this.product.id !== 0) {
      this.restaurantDashboardService
        .getListSupplementByProductIdAndBusinessId(restaurantId, this.product.id)
        .subscribe((response) => {
          if (response.ok) {
            this.listAlreadyExists = response.lists;
            this.suppAlreadyExists = response.supplementProducts;
          }
        });
    }

  }

  onDeleteList(listId: number) {
    this.listAlreadyExists = this.listAlreadyExists.filter((elem) => {
      return +elem.id !== +listId;
    });
  }
  onDeleteSup(supId: number) {
    this.suppAlreadyExists = this.suppAlreadyExists.filter((elem) => {
      return +elem.id !== +supId;
    });
  }

  onChangeListSup(event) {
    // const indexF = event.target.options.selectedIndex;
    this.listSupps.forEach((elem, index) => {
      if (+elem.id === +this.listSelectedId) {
        console.warn('elem', elem);
        if (this.listAlreadyExists) {
          if (this.listAlreadyExists.length > 0) {
            const isPresent = this.listAlreadyExists.findIndex((sup) => +sup.id === +elem.id);
            if (isPresent === -1) {
              this.listAlreadyExists = [...this.listAlreadyExists, elem];
            }
          } else {
            this.listAlreadyExists = [...this.listAlreadyExists, elem];
          }
        } else {
          if (typeof this.listAlreadyExists === 'undefined') {
            this.listAlreadyExists = [];
          }
          this.listAlreadyExists = [...this.listAlreadyExists, elem];
        }
      }
    });
  }

  onChangeSup(event) {
    // const indexF = event.target.options.selectedIndex;
    this.suppAvailable.forEach((elem, index) => {
      if (+elem.id === +this.supSelectedId) {
        console.warn('elem', elem);
        if (this.suppAlreadyExists) {
          if (this.suppAlreadyExists.length > 0) {
            const isPresent = this.suppAlreadyExists.findIndex((sup) => +sup.id === +elem.id);
            if (isPresent === -1) {
              this.suppAlreadyExists = [...this.suppAlreadyExists, elem];
            }
          } else {
            this.suppAlreadyExists = [...this.suppAlreadyExists, elem];
          }
        } else {
          if (typeof this.suppAlreadyExists === 'undefined') {
            this.suppAlreadyExists = [];
          }
          this.suppAlreadyExists = [...this.suppAlreadyExists, elem];
        }
      }
    });
  }
}
