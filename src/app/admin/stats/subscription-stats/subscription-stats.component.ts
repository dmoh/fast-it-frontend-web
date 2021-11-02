import { Component, OnInit } from '@angular/core';
import {AdminService} from "@app/admin/admin.service";
import {StatsSubscription} from "@app/_models/stats-subscription";

@Component({
  selector: 'app-subscription-stats',
  templateUrl: './subscription-stats.component.html',
  styleUrls: ['./subscription-stats.component.scss']
})
export class SubscriptionStatsComponent implements OnInit {
  stats: StatsSubscription[] = [];
  valueInProgress: number = 0;
  current: number = 555;
  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.adminService
        .getStatsSubscription()
        .subscribe((response) => {
          if (response.ok) {
            this.stats = response.stats
          }
        });
  }

    handleCurrentValue($event: any) {
      console.warn($event);

      this.valueInProgress = $event;

    }
}
