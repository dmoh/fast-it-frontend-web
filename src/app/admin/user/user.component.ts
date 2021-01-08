import { Component, OnInit } from '@angular/core';
import {AdminService} from "@app/admin/admin.service";
import {Deliverer} from "@app/_models/deliverer";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  month: string;
  deliverers: Deliverer[];
  constructor(
    private adminService: AdminService
  ) { }

  ngOnInit(): void {
    this.adminService.getDelivererList()
      .subscribe((res) => {
        this.deliverers = res.deliverers;
        this.month = res.month;
      });
  }

}
