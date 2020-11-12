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
import { AuthenticationService } from '@app/_services/authentication.service';
import jwtDecode from 'jwt-decode';

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
    private router: Router,
    private snackBar: MatSnackBar,
    private authenticate: AuthenticationService,
    private bottomSheet: MatBottomSheet) { 
      this.rolesBloqued();
    }

  ngOnInit(): void {
    // recuperer la geoloc
    if(navigator.geolocation) {
      // L'API est disponible
    } else {
      // Pas de support, proposer une alternative ?
    }
  }

  rolesBloqued() {
    let currentUser: any = jwtDecode(this.authenticate.currentUserValue.token);

    if (typeof currentUser != undefined && currentUser.roles && currentUser.roles.length > 0) {
      let isAuthorized: boolean = false;
      this.authorizedRoles.forEach( role => {
        isAuthorized = currentUser.roles.includes(role.trim()) || isAuthorized;
      });

      if (!isAuthorized) {
        console.log("Vous n'avez pas acces à cette page vous n'êtes pas un livreur.");
        this.router.navigate(['home']);
      }
    } else {
      this.router.navigate(['home']);
    }
  }
  
}
