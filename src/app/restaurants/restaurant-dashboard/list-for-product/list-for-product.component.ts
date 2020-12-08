import {Component, ElementRef, Input, OnInit, Optional, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ListSupplements} from '@app/_models/list-supplements';
import {Supplement} from '@app/_models/supplement';
import {RestaurantDashboardService} from "@app/restaurants/restaurant-dashboard/services/restaurant-dashboard.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-list-for-product',
  templateUrl: './list-for-product.component.html',
  styleUrls: ['./list-for-product.component.scss']
})
export class ListForProductComponent implements OnInit {
  suppSelected: any[];
  suppNoSelected: any[];
  listAvailableRestaurant = new FormControl();
  listSupplementRestaurant: ListSupplements[] = [];
  supps = new FormControl();
  suppList: Supplement[] = [];
  error: string;
  @Input() restaurantId: number;
  @Input() listSupplement: ListSupplements;
  @Optional() listSupplementId: number;
  constructor(
    private restaurantDashboardService: RestaurantDashboardService,
    public modalActive: NgbActiveModal
  ) {

  }
  ngOnInit(): void {
    this.suppSelected = this.listSupplement.supplementProducts;
    console.log('listSup', this.listSupplement);
    this.restaurantDashboardService
      .getSupplementByBusinessId(this.restaurantId)
      .subscribe((res) => {
        if (res.ok){
          this.suppList = res.supplements;
        }
      });
    this.restaurantDashboardService
      .getListSupplementByBusinessId(this.restaurantId)
      .subscribe((res) => {
        if (res.ok){
          console.log(res);
          this.listSupplementRestaurant = res.lists;
        }
      });
  }

  add(): void {

  }

  remove(fruit: string): void {

  }

  selected(): void {

  }

  onChange(event): void {
    this.listSupplement.supplementProducts = event;
    this.suppSelected = event;
  }
  onChoiceList(event): void {
    // add this subList to list
    this.listSupplement.subList = event;
    console.warn(this.listSupplement);
  }
  private _filter(value: string): void {

  }

  onChangeState() {
    if (this.listSupplement.isForMenu === true) {

    }
  }


  onSubmit(){
    if (this.listSupplement.multipleChoice === true) {
      if (this.listSupplement.maxChoice === null
        || isNaN(this.listSupplement.maxChoice)
        || +(this.listSupplement.maxChoice) === 1
      ) {
        this.error = 'Veuillez saisir le choix maximum';
        return;
      }
    }
    this.restaurantDashboardService
      .updateListSupplementByRestaurantId(
        this.restaurantId, this.listSupplement
      )
      .subscribe((res) => {
        if (res.ok) {
          this.modalActive.close('ok');
        }
      });
  }

  onFocus() {
    this.error = undefined;
  }


  onDeleteList(listId: number) {
    this.listSupplement.lists = this.listSupplement.lists.filter((elem) => {
      return elem.id !== listId;
    });
  }

  onDeleteSup(supId: number) {

    this.listSupplement.supplementProducts = this.listSupplement.supplementProducts.filter((elem) => {
      return elem.id !== supId;
    });
    this.suppSelected = this.suppSelected.filter((elem) => {
      return elem.id !== supId;
    });
  }
}
