import { Component, OnInit } from '@angular/core';
import {User} from "@app/_models/user";
import {AuthenticationService} from "@app/_services/authentication.service";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  customer: User;
  notifications: any[];
  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.authenticationService.checkIsAdmin()
      .subscribe((response) => {
        console.log(response);
      });
  }

  onReadNotifications() {

  }

}
