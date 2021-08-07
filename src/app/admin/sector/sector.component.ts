import { Component, OnInit } from '@angular/core';
import {AdminService} from "@app/admin/admin.service";
import {Sector} from "@app/_models/sector";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {SectorModalComponent} from "@app/admin/sector-modal/sector-modal.component";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-sector',
  templateUrl: './sector.component.html',
  styleUrls: ['./sector.component.scss']
})
export class SectorComponent implements OnInit {
  sectors: Sector[];
  message = 'Mise à jour effectuée avec succès!';
  constructor(
    private adminService: AdminService,
    private modal: NgbModal,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getSectorList();
  }

  private getSectorList() {
    this.adminService.getSectorList()
      .subscribe((response) => {
        if (response.sectors) {
          this.sectors = response.sectors;
        }
      })
    ;
  }
  onAddSector() {
    const modalRef = this.modal.open(SectorModalComponent);
    modalRef.result.then((res) => {
      if (res && res === 'updated') {
        this.getSectorList();
        this.displayMessage(this.message);
      }
    });
  }

  private displayMessage(message: string) {
    this.snackBar.open(message, 'ok', {
      verticalPosition: 'top',
      horizontalPosition: 'center'
    });
  }
  onChangeState(sector: Sector) {
    this.adminService.updateSector(sector)
      .subscribe((res) => {
        if (res.ok) {
          this.displayMessage(this.message);
          this.getSectorList();
        }
      });
  }

  onUpdateSector(sector: Sector) {
    const modalRef = this.modal.open(SectorModalComponent);
    modalRef.componentInstance.sectorInput = sector;
    modalRef.result.then((res) => {
      if (res && res === 'updated') {
        this.getSectorList();
        this.displayMessage(this.message);
      }
    });
  }
}
