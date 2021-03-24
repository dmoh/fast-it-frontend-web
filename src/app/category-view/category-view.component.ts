import {Component, Input, OnInit} from '@angular/core';
import {CategoryBusiness} from '@app/_models/category-business';
import {CategoryRestaurantService} from "@app/_services/category-restaurant.service";
import {Restaurant} from "@app/_models/restaurant";
import {Router} from "@angular/router";
import { timer } from 'rxjs';

@Component({
  selector: 'app-category-view',
  templateUrl: './category-view.component.html',
  styleUrls: ['./category-view.component.scss']
})
export class CategoryViewComponent implements OnInit {
  categorySelected: CategoryBusiness;
  restaurants: Restaurant[];
  shimmers: any[] = [1, 2, 3, 4, 5];
  constructor(
    private router: Router,
    private categoryRestaurantService: CategoryRestaurantService
  ) { }

  ngOnInit(): void {
    this.categoryRestaurantService
      .getCategoryRestaurant()
      .subscribe((cat) => {
        if (cat.status === 404 || cat.statusCode === 404) {
          this.router.navigate(['home']);
          return;
        }
        this.categorySelected = cat;
        const source = timer(2000);
        const subscribe = source.subscribe(val => {
          this.getRestaurants(cat);
        });
        setTimeout(() => {
          subscribe.unsubscribe();
        }, 20000);
      });
  }

  private getRestaurants(cat) {
    this.categoryRestaurantService
      .getRestaurantListAssociatedToCategory(cat.id)
      .subscribe((res) => {
        this.restaurants = res.restaurants;
      });
  }


  goToRestaurantBy(id: number) {
    this.router.navigate([`/restaurant/${id}`]);
  }



}
