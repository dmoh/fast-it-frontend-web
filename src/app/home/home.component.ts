import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  findPlace: string;
  constructor() { }

  ngOnInit(): void {
  }

  findThisPlace(event) {
    if (!!this.findPlace) {

    }
  }
}
