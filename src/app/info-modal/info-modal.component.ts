import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-info-modal',
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.scss']
})
export class InfoModalComponent implements OnInit {
  @Input() title: string;
  @Input() message: string;
  constructor(public modalActive: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
