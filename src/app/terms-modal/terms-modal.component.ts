import { Component, OnInit } from '@angular/core';
import { MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-terms-modal',
  templateUrl: './terms-modal.component.html',
  styleUrls: ['./terms-modal.component.scss']
})
export class TermsModalComponent implements OnInit {

  constructor(public dialog: MatDialogRef<any>) { }

  ngOnInit(): void {
  }

}
