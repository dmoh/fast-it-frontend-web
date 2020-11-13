import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-home-features',
  templateUrl: './home-features.component.html',
  styleUrls: ['./home-features.component.scss']
})
export class HomeFeaturesComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
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
    }
  }

}
