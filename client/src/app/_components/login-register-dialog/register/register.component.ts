import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { LoginRegisterDialogComponent } from '../login-register-dialog.component';
import { UserService } from '../../../_services/user.service';
import { SnackbarComponent } from '../../snackbar/snackbar.component';
import {
  usernameValidator, usernameAsyncValidator, emailAsyncValidator,
  passwordValidator, matchValidator
} from '../../../_models/validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [UserService, SnackbarComponent]
})
export class RegisterComponent {

  @ViewChild('regForm') private regForm;

  // Variables
  public registerForm: FormGroup;

  // NgFor register input fields
  public registerFormInputfields = [
    {
      placeholder: 'First name',
      formControlName: 'firstName',
      type: 'text',
      alert: '1 - 50 Characters, pretty please.',
      asyncAlert: '',
    }, {
      placeholder: 'Last name',
      formControlName: 'lastName',
      type: 'text',
      alert: '1 - 50 Characters, pretty please.',
      asyncAlert: '',
    }, {
      placeholder: 'Username',
      formControlName: 'username',
      type: 'text',
      alert: '3 - 50 Characters and no special characters, thanks!',
      asyncAlert: 'Username is already taken :(',
    }, {
      placeholder: 'Email',
      formControlName: 'email',
      type: 'text',
      alert: 'Not a valid e-mail address',
      asyncAlert: 'E-mail already exists, you\'re not new!',
    }, {
      placeholder: 'Password',
      formControlName: 'password',
      type: 'password',
      alert: '8 -50 Characters, pretty please.',
      asyncAlert: '',
    }, {
      placeholder: 'Confirm password',
      formControlName: 'passwordConfirm',
      type: 'password',
      alert: 'Oh ow, passwords do not match',
      asyncAlert: '',
    },
  ];

  // Register new user
  public register(registerForm) {
    this.loginRegisterDialogComponent.progressBar = true;

    // Create username index
    const usernameIndex = registerForm.username;
    registerForm.usernameIndex = usernameIndex;

    // Create user
    this.userService.registerUser(registerForm).subscribe(response => {
      this.loginRegisterDialogComponent.progressBar = false;

      if (response.error) {
        return this.snackbarComponent.snackbarError(response.error);
      }

      this.snackbarComponent.snackbarSucces(response.success);
      this.loginRegisterDialogComponent.tabPage = 0;
      this.regForm.resetForm();
    },
      error => {
        this.loginRegisterDialogComponent.progressBar = false;
        console.log(error);
      });
  }

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private snackbarComponent: SnackbarComponent,
    private loginRegisterDialogComponent: LoginRegisterDialogComponent,
  ) {
    // Form validation
    this.registerForm = this.validateRegister();
  }

  // -----------------Constructor methods------------------------

  // Validations
  private validateRegister() {
    return this.formBuilder.group({
      firstName: ['asd', [
        Validators.required, Validators.minLength(1),
        Validators.maxLength(50)
      ]],

      lastName: ['asd', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50),
      ]],

      username: ['asd', [
        Validators.required,
        usernameValidator({ noSpecialCharacters: true, minLength: 3, maxLength: 50 }),
      ], [
          usernameAsyncValidator({ debounceTime: 500, service: this.userService }),
        ]
      ],

      email: ['asd@asd', [
        Validators.required,
        Validators.email
      ], [
          emailAsyncValidator({ debounceTime: 500, service: this.userService }),
        ]
      ],

      lname: [null, [
        Validators.maxLength(50),
      ]],

      password: ['password', [
        Validators.required,
        passwordValidator({ minLength: 8, maxLength: 50 }),
      ]],

      passwordConfirm: ['password', [
        Validators.required,
        passwordValidator({ minLength: 8, maxLength: 50 }),
        matchValidator('password'),
      ]],
    });
  }

}
