import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from '../../../_services/user.service';
import { SnackbarComponent } from '../../snackbar/snackbar.component';
import { LoginRegisterDialogComponent } from '../login-register-dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService, SnackbarComponent]
})
export class LoginComponent {

  // Variables
  public loginForm: FormGroup;

  // NgFor login input fields
  public loginFormInputfields = [
    {
      placeholder: 'Email',
      formControlName: 'email',
      type: 'text',
      alert: '3 - 50 Characters',
      asyncAlert: '',
    }, {
      placeholder: 'Password',
      formControlName: 'password',
      type: 'password',
      alert: '8 -50 Characters',
      asyncAlert: '',
    },
  ];

  // Events
  public login(loginForm) {
    this.loginRegisterDialogComponent.progressBar = true;

    // Login user
    this.userService.login(loginForm).subscribe(response => {
      this.loginRegisterDialogComponent.progressBar = false;

      if (response.error) {
        return this.snackbarComponent.snackbarError(response.error);
      }

      this.router.navigate(['/user']);
      this.snackbarComponent.snackbarSucces(response.success);
      this.loginRegisterDialogComponent.matDialog.close();
    },
      error => {
        this.loginRegisterDialogComponent.progressBar = false;
      });
  }

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private snackbarComponent: SnackbarComponent,
    private loginRegisterDialogComponent: LoginRegisterDialogComponent,
  ) {
    // Form validation
    this.loginForm = this.validateLogin();
  }

  // -----------------Constructor methods------------------------

  // Validations
  private validateLogin() {
    return this.formBuilder.group({
      email: ['henkie@henk.nl', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ]],
      password: ['password', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(50),
      ]],
      lname: [null, [
        Validators.maxLength(50),
      ]],
    });
  }


}
