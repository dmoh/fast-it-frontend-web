import { Component, OnInit } from '@angular/core';
import { DeliveryService } from './services/delivery.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { User } from '@app/_models/user';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss']
})
export class DeliveryComponent implements OnInit {

  orders: any;
  deliverer: User;
  authorizedRoles: string[] = ["ROLE_SUPER_ADMIN","ROLE_DELIVERER"];

  constructor(private deliveryService: DeliveryService,
    private snackBar: MatSnackBar,
    private router: Router,
    private bottomSheet: MatBottomSheet) { 
      // this.router.navigate(['/delivery/awaiting-delivery']);
    }

  ngOnInit(): void {
    // recuperer la geoloc
    if(navigator.geolocation) {
      // L'API est disponible
    } else {
      // Pas de support, proposer une alternative ?
    }
    
    this.deliveryService.getDeliverer().subscribe( deliverer => {
      console.log("this.deliverer" , deliverer);
      this.deliverer = deliverer;

      let isAuthorized: boolean = false;
      console.log("before", isAuthorized);
      this.authorizedRoles.forEach( role => {
        console.log(role.trim());
        isAuthorized = this.deliverer.roles.indexOf(role.trim()) > 0 || isAuthorized;
      });
      console.log("after", isAuthorized);
      if (!isAuthorized) {
        this.router.navigate(['home']);
      }
    });

  }
  
}
