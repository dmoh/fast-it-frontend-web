import { Component, OnInit } from '@angular/core';
import {Restaurant} from "@app/_models/restaurant";
import {AdminService} from "@app/admin/admin.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {EditCommerceComponent} from "@app/admin/commerce/edit-commerce/edit-commerce.component";
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {CategoryProduct} from "@app/_models/category-product";

@Component({
  selector: 'app-commerce',
  templateUrl: './commerce.component.html',
  styleUrls: ['./commerce.component.scss']
})
export class CommerceComponent implements OnInit {

  commerce: Restaurant;
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  commerces: Restaurant[];
  nbCommerce: number;
  constructor(
    private adminService: AdminService,
    private modal: NgbModal,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCommerces();
  }

  onAddCommerce() {
    this.commerce = new Restaurant();
    this.commerce.id = 0;
    this.openModal(true);
  }

  onEditCommerce(restaurant: Restaurant) {
    this.commerce = restaurant;
    this.router.navigate([`/restaurant-dashboard/${restaurant.id}/commerce`]);
    // this.openModal();
  }

  private openModal(isNew?: boolean) {
    let modalRef = this.modal.open(EditCommerceComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg'
    });
    if (isNew) {
      modalRef = this.modal.open(EditCommerceComponent, {
        size: 'lg'
      });
    }
    modalRef.componentInstance.commerce = this.commerce;
    modalRef.result.then((res) => {
      if (res === 'ok') {
        this.loadCommerces();
      }
    });
  }

  private loadCommerces() {
    this.adminService.getRestaurantList()
      .subscribe((response) => {
        if (response.ok) {
          this.commerces = response.restaurants;
          this.nbCommerce = response.nbCommerce;
        }
      });
  }

  onDelete(restaurantId: number) {
  }

  onChange(event, commerce: Restaurant) {
    this.adminService.changeCommerceState(commerce.id, commerce.closed)
      .subscribe((res) => {
        let info = `Restaurant ${commerce.name} est ouvert`;
        if (commerce.closed === true) {
          info = `Restaurant ${commerce.name} est fermé`;
        }
        this.snackBar.open(info, '', {
          duration: 5000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      });
    console.log('commerce', {com: commerce, ev: event});
  }

  onActivate(event, commerce: Restaurant) {
    this.adminService.activateCommerce(commerce.id, commerce.active)
      .subscribe((res) => {
        let info = `Restaurant ${commerce.name} est inactif`;
        if (commerce.active === true) {
          info = `Restaurant ${commerce.name} est actif`;
        }
        this.snackBar.open(info, 'ok', {
          duration: 5000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      });
  }
  drop(event: CdkDragDrop<Restaurant[]>) {
    moveItemInArray(this.commerces, event.previousIndex, event.currentIndex);
  }


  onValidatePosition() {
    let commercePosition = [];
    this.commerces.forEach((restaurant, index) => {
      commercePosition = [...commercePosition, {restaurantId: restaurant.id, position: index++}];
    });

    this.adminService.updatePositionCommerce(commercePosition)
      .subscribe((res) => {
        if (res.ok) {
          this.snackBar.open('Positionnement des restaurants enregistrées!', 'OK', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
        }
      });
  }
}


