import { Component, OnInit } from '@angular/core';
import { DeliveryService } from './services/delivery.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss']
})
export class DeliveryComponent implements OnInit {

  orders: any;

  constructor(private deliveryService: DeliveryService,
    private snackBar: MatSnackBar,
    private router: Router,
    private bottomSheet: MatBottomSheet) { 
      this.router.navigate(['/delivery/awaiting-delivery']);
    }

  ngOnInit(): void {
    // recuperer la geoloc
    if(navigator.geolocation) {
      // L'API est disponible
    } else {
      // Pas de support, proposer une alternative ?
    }
  }
  
}
