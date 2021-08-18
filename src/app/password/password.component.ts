import { Component, OnInit } from '@angular/core';
import {UserService} from '@app/_services/user.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from "@angular/router";

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {
  loginForm: FormGroup;
  error: string;
  submitted: boolean;
  info: string;
  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.submitted = false;
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
    });
  }

  get f() { return this.loginForm.controls; }
  onSubmit(): void {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    this.userService.passwordForgot(JSON.stringify(this.loginForm.value))
      .subscribe((res) => {
        if (res.ok) {
          this.info = 'Votre mot de passe a bien été modifié et envoyé dans votre boite mail.';
        } else if (res.error) {
          this.info = null;
          this.error = res.error;
        }
      });
  }

  onGotoLogin() {
    this.router.navigate(['/login']);
  }
}
