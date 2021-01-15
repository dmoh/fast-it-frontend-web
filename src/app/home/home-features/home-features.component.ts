import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {RestaurantDashboardService} from "@app/restaurants/restaurant-dashboard/services/restaurant-dashboard.service";
import {Restaurant} from "@app/_models/restaurant";

@Component({
  selector: 'app-home-features',
  templateUrl: './home-features.component.html',
  styleUrls: ['./home-features.component.scss']
})
export class HomeFeaturesComponent implements OnInit {

  restaurants: Restaurant[];
  constructor(private router: Router,
              private restaurantService: RestaurantDashboardService
              ) { }

  ngOnInit(): void {
    this.restaurantService
      .getAllbusinesses()
      .subscribe((res) => {
        if (res.ok) {
          this.restaurants = res.restaurants;
        }
      });
  }

  goToRestaurantBy(id: number) {
    this.router.navigate([`/restaurant/${id}`]);
  }
  goTo(restaurant: string) {
    switch (restaurant) {
      case 'pizza-bella':
        this.router.navigate(['/restaurant/21']);
        break;
      case 'pizza-delices':
        this.router.navigate(['/restaurant/24']);
        break;
      case 'mister-food':
        this.router.navigate(['/restaurant/22']);
        break;
      case 'pizza-des-lacs':
        this.router.navigate(['/restaurant/23']);
        break;
      case 'o-gout-braise':
        this.router.navigate(['/restaurant/30']);
        break;
      case 'marnaz-pizza':
        this.router.navigate(['/restaurant/31']);
        break;
      case 'le-soixante-14':
        this.router.navigate(['/restaurant/34']);
        break;
      case 'on-nem':
        this.router.navigate(['/restaurant/32']);
        break;
      case 'wactoob':
        this.router.navigate(['/restaurant/29']);
        break;
      case 'pizzeria-de-la-gare':
        this.router.navigate(['/restaurant/33']);
        break;
      case 'the-old-school-fast-food':
        this.router.navigate(['/restaurant/41']);
        break;
      case 'pizza':
        this.router.navigate(['/restaurant/43']);
        break;
      case 'pizzeria-nonna-rosa':
        this.router.navigate(['/restaurant/39']);
        break;
      case 'kebab-des-lacs':
        this.router.navigate(['/restaurant/37']);
        break;
      case 'bontacos':
        this.router.navigate(['/restaurant/35']);
        break;
      case 'seven-7':
        this.router.navigate(['/restaurant/42']);
        break;
      case 'panama':
        this.router.navigate(['/restaurant/40']);
        break;
      case 'bonneville-kebab':
        this.router.navigate(['/restaurant/47']);
        break;
      case 'efsane-kebab':
        this.router.navigate(['/restaurant/49']);
        break;
      case 'dolce-pizza':
        this.router.navigate(['/restaurant/38']);
        break;
      case 'jem-s-kebab':
        this.router.navigate(['/restaurant/48']);
        break;
      case 'brasserie-la-rochoise':
        this.router.navigate(['/restaurant/50']);
        break;
      case 'la-cabane-a-pizza':
        this.router.navigate(['/restaurant/51']);
        break;
    }
  }


}
