import {Component, OnDestroy, OnInit} from '@angular/core';
import {AdminService} from "@app/admin/admin.service";
import { codeCurrentPage } from "@app/_util/fasteat-constants";
import {Subscription, timer} from "rxjs";

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.scss']
})
export class TrackingComponent implements OnInit, OnDestroy {

  codeCurrentPage = codeCurrentPage;
  timerSubscription: Subscription;

  tracks: any[] = [/*
    {
      email: 'mdfd@fdf.fr',
      currentPage: 2,
      businessName: 'Mister Food',
      cityBusiness: 'Cluses',
      cityDestination: 'Sallanches',
      amountCart: 1542,
      hour: '13h15'
    },{
      email: 'mdfd@fdf.fr',
      currentPage: 2,
      businessName: 'Mister Food',
      cityBusiness: 'Cluses',
      cityDestination: 'Sallanches',
      amountCart: 1542,
      hour: '13h15'
    },{
      email: 'mdfd@fdf.fr',
      currentPage: 3,
      businessName: 'Mister Food',
      cityBusiness: 'Cluses',
      cityDestination: 'Sallanches',
      amountCart: 1542,
      hour: '13h15'
    },
  */];
  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    const source = timer(4000, 8000);
    this.timerSubscription = source.subscribe(val => {
      this.getTracks()
    });

  }

  ngOnDestroy() {
    this.timerSubscription.unsubscribe();
  }

  private getTracks() {
    this.adminService.getTracks()
        .subscribe((datas) => {
          if (datas.ok) {
            this.tracks = datas.tracks;
          } else {
            this.tracks = [];
          }
        }
    );
  }
}
