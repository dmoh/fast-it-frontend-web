import {Component, Input, OnInit, Optional} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Sector} from '@app/_models/sector';
import {AdminService} from '@app/admin/admin.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-sector-modal',
  templateUrl: './sector-modal.component.html',
  styleUrls: ['./sector-modal.component.scss']
})
export class SectorModalComponent implements OnInit {
  sectorForm: FormGroup;
  sector: Sector = new Sector();
  @Optional() sectorInput: Sector;
  showForm: boolean = false;
  addType: string;
  inputToFind: string = '';
  showSpinner: boolean = false;
  label: string = '';
  datasFound: any[];
  datas: any[];
  constructor(private fb: FormBuilder,
              private adminService: AdminService,
              public  modalActive: NgbActiveModal,
              private snackBar: MatSnackBar
              ) { }

  ngOnInit(): void {
    if (this.sectorInput) {
      this.sector = this.sectorInput;
    }
    this.sectorForm = this.fb.group({
      name: [this.sector.name, [Validators.required, Validators.minLength(3)]],
      isActive: this.sector.isActive
    });
  }

  onSubmit() {
    if (this.sectorForm.invalid) {
      return;
    }
    this.sector = Object.assign(this.sector, this.sectorForm.value);
    this.adminService.updateSector(this.sector)
      .subscribe((response) => {
        if (response.ok) {
            this.modalActive.close('updated');
        }
      });
  }

  private hideAll() {

  }
  onAdd(part: string) {
    this.addType = part;
    this.showInput();
  }



  private showInput(){
    this.showForm = false;
    this.showSpinner = true;
    setTimeout(() => {
      this.showForm = !this.showForm;
      this.showSpinner = !this.showSpinner;
    }, 1500);
  }

  onFind() {
    this.adminService
      .findByNameCurrent(this.inputToFind, this.addType)
      .subscribe((response) => {
        if (response.businesses) {
          this.datasFound = response.businesses;
        }
        if (response.deliverers) {
          this.datasFound = response.deliverers;
        }
        if (response.sectors) {
          this.datasFound = response.sectors;
        }
      });
  }

  addThis(data: any) {
    this.adminService
      .updateElementSector(this.sector.id, data.id, this.addType)
      .subscribe((response) => {
        if (response.ok) {
          this.modalActive.close('updated');
          this.snackBar.open('Mise à jour avec succès', 'ok');
        }
      });
  }

  onDelete(element: any, type: string) {
    this.adminService
      .deleteElementSector(this.sector.id, element.id, type)
      .subscribe((response) => {
        if (response.ok) {
          this.modalActive.close('updated');
          this.snackBar.open('Mise à jour avec succès', 'ok');
        }
      });
  }
}
