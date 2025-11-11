import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AuthService } from './auth-service';
import { LoginInterface } from '../interface/login-interface';
import { LoginFormInterface } from '../interface/login-form-interface';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-auth',
  imports: [ButtonModule, 
    CardModule,
    ReactiveFormsModule,
    MessageModule,
    InputTextModule,
    PasswordModule,
    ToastModule],
  templateUrl: './auth.html',
  styleUrl: './auth.scss'
})
export class Auth implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);
  messageService = inject(MessageService);

  loginForm: FormGroup<LoginFormInterface>;
  formSubmitted = false;

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.loginForm = new FormGroup<LoginFormInterface>({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required),
    });
  }

  onSubmit() {
        this.formSubmitted = true;
        if (this.loginForm.valid) {
            this.login();
        }
    }

  login(){
    const data: LoginInterface = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };
    this.authService.login(data).subscribe(res => {
      localStorage.setItem('token', res.accessToken);
      localStorage.setItem('login', data.email);
      this.messageService.add({ severity: 'success', summary: 'Zalogowano', detail: 'Zalogowano pomyślnie', life: 3000 });
      this.loginForm.reset();
      this.formSubmitted = false;
      this.router.navigate(['/home']);
    }, err => {
      let errorResponse: HttpErrorResponse = err;
      switch (errorResponse.status)
      {
        case HttpStatusCode.Unauthorized:
          this.messageService.add({ severity: 'error', summary: 'Błąd logowania', detail: 'Błędny email lub hasło', life: 3000 });
          break;

        case HttpStatusCode.ServiceUnavailable:
          this.messageService.add({ severity: 'error', summary: 'Błąd logowania', detail: 'Usługa jest niedostępna', life: 3000 });
          break;

        default:
          this.messageService.add({ severity: 'error', summary: 'Błąd logowania', detail: errorResponse.message, life: 3000 });
          break;
      }
      this.loginForm.reset();
      this.formSubmitted = false;
    });
  }

  isInvalid(controlName: string) {
    const control = this.loginForm.get(controlName);
    return control?.invalid && (control.touched || this.formSubmitted);
  }
}
