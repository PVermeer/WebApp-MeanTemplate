import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';

import { UserDialogComponent } from '../user-dialog.component';
import { UserService } from '../.././user.service';
import { usernameValidator, usernameAsyncValidator, emailAsyncValidator, passwordValidator, matchValidator } from '../../validators';
import { DialogComponent } from '../../../_shared/components/dialog/dialog.component';
import { UserRegister } from '../../../../../../server/database/models/users/user.types';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {

  // Get elements
  @ViewChild('regForm') private regForm: NgForm;

  // Variables
  public registerForm: FormGroup;
  public registerSuccess = false;
  public disableButtons = false;

  public successTitle = 'Success!';
  public successBody: string;

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

  // Methods
  public register(registerForm: UserRegister) {
    this.userDialogComponent.progressBar = true;
    this.disableButtons = true;

    // Save user to the db
    this.userService.registerUser(registerForm).subscribe(response => {
      this.userDialogComponent.progressBar = false;
      this.disableButtons = false;

      this.successBody = response;
      this.registerSuccess = true;
      this.regForm.resetForm();

      // Catch errors
    }, () => {
      this.userDialogComponent.progressBar = false;
      this.disableButtons = false;
    });
  }

  public closeDialog() { this.dialogComponent.matDialog.close(); }

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private userDialogComponent: UserDialogComponent,
    private dialogComponent: DialogComponent,
  ) {
    // Form validation
    this.registerForm = this.validateRegister();
  }

  // Constructor methods
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