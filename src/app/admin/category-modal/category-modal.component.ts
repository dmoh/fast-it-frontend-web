import {Component, Input, OnInit} from '@angular/core';
import {CategoryBusiness} from "@app/_models/category-business";
import {AdminService} from "@app/admin/admin.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-category-modal',
  templateUrl: './category-modal.component.html',
  styleUrls: ['./category-modal.component.scss']
})
export class CategoryModalComponent implements OnInit {

  @Input() category: CategoryBusiness;
  businesses: any[];
  restaurantName: string;
  restaurants: any[];
  showFormResto: boolean = false;
  constructor(private adminService: AdminService,
              private snackBar: MatSnackBar,
              public modalActive: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.adminService.getBusinessByCategoryId(this.category.id)
      .subscribe((res) => {
        if (res.businesses) {
          this.businesses = res.businesses;
        }
      });
  }

  onAddResto() {
    this.showFormResto = true;
  }

  onFindResto() {
    this.adminService.getBusinessByName(this.restaurantName)
      .subscribe((res) => {
        if (res.restaurants) {
          this.restaurants = res.restaurants;
        }
      });
  }

  onAddRestoThis(restaurant: any) {
    this.adminService.addRestoToCategory(restaurant.id, this.category.id)
      .subscribe((res) => {
          if (res.ok) {
            this.snackBar.open(restaurant.name + ' a été ajouté à la catégorie ' + this.category.name, 'ok', {
              verticalPosition: 'top',
              horizontalPosition: 'center'
            });
            this.modalActive.close();
          }
      });
  }

  onDeleteThisBusiness(business: any) {
    this.adminService.removeRestoToCategoryId(business.id, this.category.id)
      .subscribe((res) => {
        if (res.ok) {
          this.snackBar.open(business.name + ' a été supprimé de la catégorie ' + this.category.name, 'ok', {
            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
          this.modalActive.close();
        }
      });
  }

  onUpdateCategory() {
    this.adminService.updateCategoryCurrent(this.category)
      .subscribe((res) => {
        if (res.ok) {
          this.snackBar.open('Catégorie Mise à jour', 'ok', {
            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
          this.modalActive.close();
        }
      });
  }
}
