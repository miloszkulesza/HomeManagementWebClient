import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AuthService } from './auth-service';
import { LoginInterface } from '../interface/login-interface';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-auth',
  imports: [ButtonModule, 
    CardModule,
    ReactiveFormsModule,
    MessageModule,
    InputTextModule,
    PasswordModule],
  templateUrl: './auth.html',
  styleUrl: './auth.scss'
})
export class Auth {
  authService = inject(AuthService);
  router = inject(Router);
  messageService = inject(MessageService);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });
  formSubmitted = false;

  onSubmit() {
        this.formSubmitted = true;
        if (this.loginForm.valid) {
            let email = this.loginForm.get('email')?.value;
            let password = this.loginForm.get('password')?.value;
            this.login(email!, password!);
            
        }
    }

  login(email: string, password: string){
    const data: LoginInterface = {
      //email: 'milosz.kulesza1@gmail.com',
      //password: 'C@ptainjack90'
      email: email,
      password: password
    };
    this.authService.login(data).subscribe(res => {
      localStorage.setItem('token', res.accessToken);
      localStorage.setItem('login', data.email);
      this.messageService.add({ severity: 'success', summary: 'Zalogowano', detail: 'Zalogowano pomyślnie', life: 3000 });
      this.loginForm.reset();
      this.formSubmitted = false;
      this.router.navigate(['/home']);
    });
  }

  isInvalid(controlName: string) {
    const control = this.loginForm.get(controlName);
    return control?.invalid && (control.touched || this.formSubmitted);
  }
}
