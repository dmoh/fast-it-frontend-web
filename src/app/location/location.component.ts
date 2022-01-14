import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {CityDataService} from '@app/city-data.service';
import {RestaurantDashboardService} from '@app/restaurants/restaurant-dashboard/services/restaurant-dashboard.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LocationModalComponent} from '@app/location-modal/location-modal.component';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {

  @Input() isLoginPage = true;
  options: {} = {};
  cityDataCurrent: any;
  selectedAddress: any;
  slideHeight: string = '200px';
  maintainAspectRatio: boolean = false;
  showingLeftPart: boolean = true;
  @Output() closeModale = new EventEmitter<any>();
  constructor(private route: Router,
              private cityData: CityDataService,
              private restaurantService: RestaurantDashboardService,
              private modal: NgbModal,
              private router: Router,
              private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.cityData.getCityData().subscribe((res) => {
      this.cityDataCurrent = res;
    });
    this.options = {
      types: [],
      componentRestrictions: { country: 'FR' }
    };
  }

  onChangeLocation() {
    const modalRef = this.modal.open(LocationModalComponent);
    modalRef.result.then((response) => {
      if (response && response === 'updated') {
        this.router.navigateByUrl('home?anchor=resto');
        /*this.router.navigate(['home'], { queryParams: {anchor: 'resto'}
        });*/
        this.closeModale.emit('change');
      }
    });
  }

}
