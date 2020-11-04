import { Component, OnInit } from '@angular/core';
import {Restaurant} from "@app/_models/restaurant";
import {AdminService} from "@app/admin/admin.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {EditCommerceComponent} from "@app/admin/commerce/edit-commerce/edit-commerce.component";

@Component({
  selector: 'app-commerce',
  templateUrl: './commerce.component.html',
  styleUrls: ['./commerce.component.scss']
})
export class CommerceComponent implements OnInit {

  commerce: Restaurant;
  commerces: Restaurant[];
  constructor(
    private adminService: AdminService,
    private modal: NgbModal
  ) { }

  ngOnInit(): void {
    this.loadCommerces();
  }

  onAddCommerce() {
    this.commerce = new Restaurant();
    this.commerce.id = 0;
    this.openModal();
  }

  onEditCommerce(restaurant: Restaurant) {
    this.commerce = restaurant;
    this.openModal();
  }

  private openModal() {
    const modalRef = this.modal.open(EditCommerceComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg'
    });
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
        }
      });
  }

  onDelete(restaurantId: number) {
  }
}


