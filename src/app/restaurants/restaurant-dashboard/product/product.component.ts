import { Component, OnInit } from '@angular/core';
import {RestaurantDashboardService} from '@app/restaurants/restaurant-dashboard/services/restaurant-dashboard.service';
import {RestaurantDashboardComponent} from '@app/restaurants/restaurant-dashboard/restaurant-dashboard.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {UpdateDialogComponent} from '@app/restaurants/restaurant-dashboard/product/update-dialog/update-dialog.component';
import {Product} from '@app/models/product';
import {UploadService} from '@app/_services/upload.service';
import {CategoryProductComponent} from '@app/restaurants/restaurant-dashboard/category-product/category-product.component';
import {AddProductDialogComponent} from '@app/restaurants/restaurant-dashboard/category-product/add-product-dialog/add-product-dialog.component';
import {ActivatedRoute, Router} from '@angular/router';
import {SecurityRestaurantService} from '@app/_services/security-restaurant.service';
import {CategoryProduct} from '@app/_models/category-product';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ListForProductComponent} from "@app/restaurants/restaurant-dashboard/list-for-product/list-for-product.component";
import {ListSupplements} from "@app/_models/list-supplements";
import {SupplementForProductComponent} from "@app/restaurants/restaurant-dashboard/supplement-for-product/supplement-for-product.component";
import {Supplement} from "@app/_models/supplement";
import {SpecialOfferModalComponent} from "@app/restaurants/restaurant-dashboard/special-offer-modal/special-offer-modal.component";
import {SpecialOffer} from "@app/_models/special-offer";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  restaurantDatas: any;
  restaurant: any;
  productsResto: Product[];
  categories: any[];
  supplements: Supplement[];
  productBeforeUpdate: any;
  listSupps: ListSupplements[];
  findProduct: string = '';
  arraySearchProduct: Product[] = [];
  specialOffers: SpecialOffer[];
  hasRoleSuperAdmin: boolean = false;
  constructor(private restaurantService: RestaurantDashboardService,
              public dialog: MatDialog,
              public uploadService: UploadService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private securityRestaurantService: SecurityRestaurantService,
              private snackBar: MatSnackBar,
              private modalService: NgbModal
              ) {
    // Check if has role Super Admin
    if (localStorage.getItem('roles')){
      const roles = JSON.parse(localStorage.getItem('roles'));
      if (roles.indexOf('ROLE_ADMIN') !== -1) {
        this.hasRoleSuperAdmin = true;
      }
      if (roles.indexOf('ROLE_SUPER_ADMIN') !== -1) {
        this.hasRoleSuperAdmin = true;
      }
    }
  }

  ngOnInit(): void {
    this.updateProductList();
  }

  updateProductList(restaurantId?: number, reload?: string) {
    this.securityRestaurantService.getRestaurant()
      .subscribe((restaurantObj) => {
        if (!isNaN(restaurantObj.id)) {
          this.getSpecialOffers(restaurantObj.id);
          this.restaurantService.getRestaurantDatas(restaurantObj.id).subscribe((res) => {
            this.restaurant = RestaurantDashboardComponent.extractRestaurantData('business', res);
            if (this.restaurant === null && +(restaurantObj.id) > 0) {
              this.restaurantService.getRestaurantInfosById(restaurantObj.id)
                .subscribe((restaurantDb) => {
                  this.restaurant = restaurantDb.restaurant;
                });
            }
            if (this.hasRoleSuperAdmin) {
              this.getListSupp(restaurantObj.id);
            }
            this.restaurantService.getProductListByBusinessId(restaurantObj.id)
              .subscribe((responseDb) => {
                this.productsResto = responseDb.products;
              });
            this.restaurantService.getCategoriesByBusinessId(restaurantObj.id)
              .subscribe((cat) => {
                this.categories = cat;
              });
          });
        } else {
          this.router.navigate(['home']);
        }
      });
  }

  private getListSupp(restaurantId) {
    this.restaurantService.getListSupplementByBusinessId(restaurantId)
      .subscribe((resList) => {
        if (resList.ok) {
          this.listSupps = resList.lists;
        }
      });
    this.restaurantService.getSupplementByBusinessId(restaurantId)
      .subscribe((response) => {
        if (response.ok) {
          this.supplements = response.supplements;
        }
      });
  }
  onDelete(type: string, {product, supplement}): void {
    switch (type) {
      case 'supplement':
        this.productsResto = this.productsResto.filter((prod) => {
           if (+(prod.id) === product.id) {
             prod.supplementsProduct = prod.supplementsProduct.filter((elem) => {
               return elem.id !== supplement;
             });
           }
           return prod;
        });
        break;
        case 'product':
        this.productsResto = this.productsResto.filter((prod) => {
           return prod.id !== product.id;
        });
        break;
    }
  }

  onDeleteCategory(categoryId: number) {
    this.restaurantService.deleteCategoryId(categoryId)
      .subscribe((res) => {
        if (res.ok) {
          this.snackBar.open('La catégorie est supprimée !', 'OK');
          this.categories = this.categories.filter((cat) => {
            return cat.id !== categoryId;
          });
        }
      });
  }

  onDeleteList(listId: number) {
    this.restaurantService.deleteListId(listId)
      .subscribe((res) => {
        if (res.ok) {
          this.snackBar.open('La liste est supprimée !', 'OK');
          this.listSupps = this.listSupps.filter((list) => {
            return list.id !== listId;
          });
        }
      });
  }


  onDeleteSupplement(supId: number) {
    this.restaurantService.deleteSupplementId(supId)
      .subscribe((res) => {
        if (res.ok) {
          this.snackBar.open('Le supplément est supprimé!', 'OK');
          this.supplements = this.supplements.filter((supplement) => {
            return supplement.id !== supId;
          });
        }
      });
  }

  openDialog(product?: Product): void {
    if (!product) {
      product = new Product();
    }

    if (product.category === null) {
      product.category = new CategoryProduct();
      product.category.id = 0;
    }
    // add business id to product
    product = Object.assign({business_id: this.restaurant.id }, product);
    this.productBeforeUpdate = Object.assign({}, product);
    const dialogRef = this.dialog.open(UpdateDialogComponent, {
      width: '60%',
      data: product
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'no-update') {
        this.productsResto = this.productsResto.filter((prod) => {
          if (prod.id === product.id) {
            prod = this.productBeforeUpdate;
          }
          return prod;
        });
      } else {
        if (result) {
          result.business_id = this.restaurant.id;
          const formData = new FormData();
          const updatedProduct = result;
          if (updatedProduct.category.id === 0) {
            result.category = null;
          }
          formData.append('product', JSON.stringify(result));
          if (result.photo) {
            formData.append('photo', result.photo);
            delete result.photo;
          }
          this.uploadService.upload(formData, 0, true)
            .subscribe((resp) => {
                this.reloadProduct(this.restaurant.id);
              }, (error) => {
                console.warn(error);
              }
            );
        }
      }
    });
  }

  onGetProductByCategory(categoryId: number): void {
    this.restaurantService.getProductByCategoryId(categoryId)
      .subscribe((prod) => {
        this.categories.forEach((cat, index) => {
          if (cat.id === categoryId) {
            this.categories[index].products = prod;
          }
        });
      });
  }


  onAddProductToCategory(category): void {
    const dialogRef = this.dialog.open(AddProductDialogComponent, {
      width: '60%',
      data: category
    });

    dialogRef.afterClosed()
      .subscribe((res) => {
        if (typeof res !== 'undefined') {
          this.onGetProductByCategory(res.ok);
        }
      });
  }

  addCategory(): void {
    const dialogRef = this.dialog.open(CategoryProductComponent, {
      width: '60%',
      data: this.restaurant
    });
    dialogRef.afterClosed()
      .subscribe((res) => {
        if (res) {
          this.restaurantService.addCategoryToRestaurant(res)
            .subscribe((response) => {
              if (response.ok) {
                console.log(response);
                this.categories = [...this.categories, response.category];
              }
            });
        }
      });
  }


  private reloadProduct(restaurantId: number) {
    this.restaurantService.getProductListByBusinessId(restaurantId)
      .subscribe((responseDb) => {
        this.productsResto = responseDb.products;
      });
    this.restaurantService.getCategoriesByBusinessId(restaurantId)
      .subscribe((cat) => {
        this.categories = cat;
      });
  }

  onValidatePosition() {
    let catPosition = [];
    this.categories.forEach((category, index) => {
      catPosition = [...catPosition, {categoryId: category.id, position: index++}];
    });

    this.restaurantService.updateCategoryProductPosition(catPosition)
      .subscribe((res) => {
        this.snackBar.open('Positionnement enregistré', '', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      });
  }

  drop(event: CdkDragDrop<CategoryProduct[]>) {
    moveItemInArray(this.categories, event.previousIndex, event.currentIndex);
  }


  onAddList(restaurantId, list?: ListSupplements) {
    const modalRef = this.modalService.open(ListForProductComponent);
    modalRef.componentInstance.restaurantId = restaurantId;
    if (list){
      modalRef.componentInstance.listSupplement = list;
    } else {
      const newList = new ListSupplements();
      newList.id = 0;
      newList.isAvailable = true;
      modalRef.componentInstance.listSupplement = newList;
    }
    modalRef.result.then((res) => {
      if (res === 'ok') {
        this.getListSupp(restaurantId);
      }
    });
  }

  onUpdateSupplement(restaurantId: number, sup?: Supplement): void {
    const modalRef = this.modalService.open(SupplementForProductComponent);
    modalRef.componentInstance.restaurantId = restaurantId;
    if (!sup) {
      const supplement = new Supplement();
      supplement.id = 0;
      modalRef.componentInstance.supplement = supplement;
      supplement.isAvailable = true;
    } else {
      sup.amount = sup.amount !== null && sup.amount !== 0 ? sup.amount / 100 : null;
      modalRef.componentInstance.supplement = sup;
    }
    modalRef.result.then((res) => {
      if (res === 'ok') {
        this.getListSupp(restaurantId);
      }
    });
  }

  addSpecialOffer(restaurantId: number) {
    const modalRef = this.modalService.open(SpecialOfferModalComponent);
    modalRef.componentInstance.restaurantId = restaurantId;
    modalRef.result.then((res) => {
      if (res && res === 'ok') {
        this.getSpecialOffers(restaurantId);
      }
    });
  }

  updateSpecialOffer(sp: SpecialOffer, restaurantId: number) {
    const modalRef = this.modalService.open(SpecialOfferModalComponent);
    modalRef.componentInstance.restaurantId = restaurantId;
    modalRef.componentInstance.specialOfferSelected = sp;
    modalRef.result.then((res) => {
      if (res && res === 'ok') {
        this.getSpecialOffers(restaurantId);
      }
    });
  }


  private getSpecialOffers(restaurantId) {
    this.restaurantService.getSpecialOfferByBusinessId(restaurantId)
      .subscribe((responseDb) => {
        this.specialOffers = responseDb.specialOffers;
      });
  }

  onChangeStateProduct(product: Product): void {
    this.restaurantService.updateStateProduct(product.id, product.isAvailable)
      .subscribe((res) => {
        if (res.ok) {
          const message = product.isAvailable === true ? 'Produit disponible' : 'Produit Indisponible';
          this.snackBar.open(message, 'ok', {
            duration: 3000
          });
        }
    });
  }


  onSearchProduct(): void {
    if (this.findProduct.trim().length >= 2) {
        this.productsResto.forEach((elem) => {
          const regExp = new RegExp(`(\s*)(${ this.findProduct })+(\s*)`, 'i');
          if (regExp.test(elem.name)) {
            const index = this.arraySearchProduct
              .findIndex((prod) => +elem.id === +prod.id);
            if (index === -1) {
              this.arraySearchProduct = [elem, ...this.arraySearchProduct];
            }
          } else {
            this.arraySearchProduct = this.arraySearchProduct
              .filter((prod) => +prod.id !== +elem.id);
          }
        });
    } else if (this.findProduct.trim().length < 2) {
      this.arraySearchProduct = [];
    }
  }
}
