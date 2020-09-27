import { Component, OnInit } from '@angular/core';
import {CustomerService} from "@app/customer/_services/customer.service";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  commentCustomer: any[];
  constructor(private customerService: CustomerService) { }

  ngOnInit(): void {
    this.customerService.getCommentCustomer(1)
      .subscribe((response) => {
        console.log(response);
        this.commentCustomer = response;
      })
    ;
  }

}
