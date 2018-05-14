import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import './modules/rxjs.module';
import { MaterialModule } from './modules/material.module';
import { SnackbarComponent } from './components/snackbar/snackbar.component';
import { CssAnimateInviewService } from './services/css-animate-inview.service';
import { PreviewImageDirective } from './directives/preview-image.directive';

import { DialogComponent } from './components/dialog/dialog.component';
import { UserDialogComponent } from '../users/user-dialog/user-dialog.component';
import { ConfirmDialogComponent } from '../users/user-details/confirm-dialog/confirm-dialog.component';
import { UserManyDialogComponent } from '../users/user-management/many-dialog/user-many-dialog.component';
import { PasswordRecoveryDialogComponent } from '../users/verify-pages/password-recovery-dialog/password-recovery-dialog.component';
import { MailService } from './services/mail.service';
import { NewPageComponent } from '../content/content-management/new-page/new-page.component';


const sharedModules = [
  CommonModule,
  MaterialModule,
  FormsModule,
  HttpClientModule,
];

@NgModule({
  imports: [
    sharedModules,
  ],
  declarations: [
    SnackbarComponent,
    DialogComponent,
    PreviewImageDirective,
  ],
  exports: [
    sharedModules,
    PreviewImageDirective,
  ],
  providers: [
    SnackbarComponent, CssAnimateInviewService, MailService
  ],
  entryComponents: [
    DialogComponent, UserDialogComponent, UserManyDialogComponent,
    ConfirmDialogComponent, PasswordRecoveryDialogComponent, NewPageComponent,
  ],

})
export class SharedModule { }
