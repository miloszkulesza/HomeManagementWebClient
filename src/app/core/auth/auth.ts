import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AuthService } from './auth-service';
import { LoginInterface } from '../interface/login-interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  imports: [ButtonModule],
  templateUrl: './auth.html',
  styleUrl: './auth.scss'
})
export class Auth {
  authService = inject(AuthService);
  router = inject(Router);

  onLoginClick(){
    const data: LoginInterface = {
      email: 'milosz.kulesza1@gmail.com',
      password: 'C@ptainjack90'
    };
    this.authService.login(data).subscribe(res => {
      localStorage.setItem('token', res.accessToken);
      localStorage.setItem('login', data.email);
      this.router.navigate(['/home']);
    });
  }
}
