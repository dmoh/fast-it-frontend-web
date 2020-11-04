import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {JwtInterceptor} from "@app/_helpers/jwt.interceptor";

@Component({
  selector: 'app-order-modal',
  templateUrl: './order-modal.component.html',
  styleUrls: ['./order-modal.component.scss']
})
export class OrderModalComponent implements OnInit {

  @Input() products: any[];
  @Input() additionalInfo: string;
  constructor(private route: ActivatedRoute,
              private jwtInterceptor: JwtInterceptor
              ) { }

  ngOnInit(): void {
  }

  onValidate(time: string) {

  }

  onRefuseOrder() {
    // avertir client
    // pourquoi refus ??
  }

}
