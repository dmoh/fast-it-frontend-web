import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-header-specific',
  templateUrl: './header-specific.component.html',
  styleUrls: ['./header-specific.component.scss']
})
export class HeaderSpecificComponent implements OnInit {
  @Output() public sidenavToggle = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }


  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }
}
