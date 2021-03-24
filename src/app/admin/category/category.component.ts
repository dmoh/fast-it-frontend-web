import { Component, OnInit } from '@angular/core';
import {CategoryBusiness} from "@app/_models/category-business";
import {AdminService} from "@app/admin/admin.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CategoryModalComponent} from "@app/admin/category-modal/category-modal.component";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  categories: CategoryBusiness[];
  addCategory: boolean = false;
  newCategory: CategoryBusiness;

  constructor(private adminService: AdminService,
              private modal: NgbModal
              ) { }

  ngOnInit(): void {
    this.getCategoryList();
  }

  private getCategoryList() {
    this.adminService.getCategoryList()
      .subscribe((res) => {
        this.categories = res.categories;
      });
  }
  onAddCategory() {
    this.newCategory = new CategoryBusiness();
    this.addCategory = true;
  }

  onValidateCategory() {
    this.adminService.updateCategoryCurrent(this.newCategory)
      .subscribe((res) => {
        if (res.ok) {
          this.addCategory = false;
          this.getCategoryList();
        }
      });
  }

  onShow(category: CategoryBusiness) {
    const modalRef = this.modal.open(CategoryModalComponent);
    modalRef.componentInstance.category = category;
  }
}
