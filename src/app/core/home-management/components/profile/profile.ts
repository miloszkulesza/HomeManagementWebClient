import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { Component, inject, OnInit } from '@angular/core';
import { ColorPickerModule } from 'primeng/colorpicker';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EditProfileFormInterface } from '../../../interface/edit-profile-form-interface';
import { UserProfileService } from '../../services/user-profile-service';
import { ApplicationUserInterface } from '../../../interface/application-users-interface';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { ApplicationUserUpdateInterface } from '../../../interface/application-user-update-interface';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  imports: [PanelModule,
    ButtonModule,
    ReactiveFormsModule, 
    ColorPickerModule,
    MessageModule, 
    ToastModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit {
  readonly messageService = inject(MessageService);
  readonly formBuilder = inject(FormBuilder);
  readonly userProfileService = inject(UserProfileService);
  currentUser: ApplicationUserInterface = null;
  editProfileForm: FormGroup<EditProfileFormInterface>;
  formSubmitted = false;

  ngOnInit() {
    this.userProfileService.getCurrentUserInfo().subscribe(res => {
      this.currentUser = res;
      this.createForm();
    })
  }

  createForm() {
    this.editProfileForm = new FormGroup<EditProfileFormInterface>({
      email: new FormControl({ value: this.currentUser.email, disabled: true }, [Validators.required, Validators.email]),
      calendarEventBackgroundColor: new FormControl(this.currentUser.calendarEventBackgroundColor, [Validators.required]),
      roles: new FormControl({ value: this.currentUser.roles, disabled: true }, [Validators.required])
    });
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.editProfileForm.valid) {
      this.updateProfile();
    }
  }

  updateProfile() {
    const data: ApplicationUserUpdateInterface = {
      calendarEventBackgroundColor: this.editProfileForm.value.calendarEventBackgroundColor
    }
    this.userProfileService.updateUserProfile(this.currentUser.id, data).subscribe(res => {
      this.messageService.add({ severity: 'success', summary: 'Sukces', detail: 'Zaktualizowano profil użytkownika', life: 3000 });
      this.editProfileForm.reset();
      this.formSubmitted = false;
      this.ngOnInit();
    }, err => {
      let errorResponse: HttpErrorResponse = err;
      switch (errorResponse.status)
      {
        case HttpStatusCode.Unauthorized:
          this.messageService.add({ severity: 'error', summary: 'Wystąpił błąd', detail: 'Użytkownik jest nieautoryzowany', life: 3000 });
          break;

        case HttpStatusCode.ServiceUnavailable:
          this.messageService.add({ severity: 'error', summary: 'Wystąpił błąd', detail: 'Usługa jest niedostępna', life: 3000 });
          break;

        default:
          this.messageService.add({ severity: 'error', summary: 'Wystąpił błąd', detail: errorResponse.message, life: 3000 });
          break;
      }
    });
  }

  isInvalid(controlName: string) {
    const control = this.editProfileForm.get(controlName);
    return control?.invalid && this.formSubmitted;
  }
}
