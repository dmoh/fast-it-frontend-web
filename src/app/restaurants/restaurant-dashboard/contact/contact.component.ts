import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  contactForm: FormGroup;
  constructor(private fb: FormBuilder,
              private snackbar: MatSnackBar
              ) { }

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      subject: '',
      message: ['', [Validators.required, Validators.minLength(20)]]
    });
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      return;
    }

    console.log(this.contactForm);
    const contact = {
      subject: this.contactForm.value.subject,
      message: this.contactForm.value.message
    };

  }

}
