import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shimmer-view',
  templateUrl: './shimmer-view.component.html',
  styleUrls: ['./shimmer-view.component.scss']
})
export class ShimmerViewComponent implements OnInit {

  shimmers: any[] = [1, 2, 3, 4, 5, 6, 7, 8];
  constructor() { }

  ngOnInit(): void {
  }

}
