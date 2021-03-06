import { Component, OnInit } from '@angular/core';
import {AdminService} from '@app/admin/admin.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-user',
  templateUrl: './modal-user.component.html',
  styleUrls: ['./modal-user.component.scss']
})
export class ModalUserComponent implements OnInit {
  userEmail: string;
  users: any[] = [];
  constructor(
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    public modalActive: NgbActiveModal
  ) { }

  ngOnInit(): void {
  }

  onSearchUser(){
    if (this.userEmail
      && this.userEmail.trim() !== ''
      && this.userEmail.length >= 3
    ){
        this.findUsers();
    }
  }

  private findUsers() {
    this.adminService.findUserByEmail(this.userEmail)
      .subscribe((res) => {
        this.users = [];
        this.users = res.users;
        if (this.users.length === 0) {
          this.snackBar.open('AUCUN UTILISATEUR TROUVE !', 'ok', {
            verticalPosition: 'top'
          });
        }
      }
    );
  }

  onUpdateRoleUser(user: any) {
    this.adminService.updateRoleUser(user)
      .subscribe((res) => {
        if (res.ok) {
          let message = user.email + ' n\'a plus le role livreur';
          if (user.hasRoleDeliverer === true) {
            message = user.email + ' a le role livreur';
          }
          this.snackBar.open(message, 'ok', {
            verticalPosition: 'top'
          });
        }
      });
  }
}
