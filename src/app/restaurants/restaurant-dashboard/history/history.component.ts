import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {RestaurantDashboardService} from '@app/restaurants/restaurant-dashboard/services/restaurant-dashboard.service';
import {SecurityRestaurantService} from '@app/_services/security-restaurant.service';
import {Order} from '@app/_models/order';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
// @ts-ignore
import {environment} from '@environments/environment';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit, AfterViewInit {
  period: string = '11/2020';
  restaurantId: number;
  displayedColumns: string[] = ['date', 'hour', 'name', 'progress', 'color', 'total'];
  dataSource: MatTableDataSource<Order[]>;
  amount: number;
  filename: string;
  urlApi: string = environment.apiUrl;
  response: any;


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private restaurantDashboardService: RestaurantDashboardService,
    private securityRestaurantService: SecurityRestaurantService
  ) { }

  ngOnInit(): void {
    this.securityRestaurantService.getRestaurant()
      .subscribe((res) => {
        this.restaurantId = res.id;
        this.onExtractPeriod();
      });
  }

  ngAfterViewInit() {
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onExtractPeriod(){
    this.restaurantDashboardService
      .getStatsByRestaurantId(this.restaurantId, this.period)
      .subscribe((response) => {
        if (response.ok) {
          this.amount = response.amount;
          this.dataSource = new MatTableDataSource(response.orders);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.filename = response.filename;
          this.response = response;
        }

        // this.dataSource = new MatTableDataSource(users);
      });
  }

}
