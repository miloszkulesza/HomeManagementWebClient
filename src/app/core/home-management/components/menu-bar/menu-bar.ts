import { Component, inject, input, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { AuthService } from '../../../auth/auth-service';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-menu-bar',
  imports: [MenubarModule, 
    ButtonModule,
    BadgeModule,
    CommonModule,
    RippleModule,
    RouterModule
  ],
  templateUrl: './menu-bar.html',
  styleUrl: './menu-bar.scss'
})
export class MenuBar implements OnInit {
  email = input<string>();
  authService = inject(AuthService);
  router = inject(Router);
  messageService = inject(MessageService);

  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Zarządzanie domem',
        icon: 'pi-home',
        items: [
          {
            label: 'Kalendarz',
            routerLink: 'calendar'
          }
        ]
      },
      {
        label: this.email(),
        icon: 'pi-user',
        tooltip: 'Profil',
        routerLink: 'profile'
      }
    ]
  }

  onLogoutClick() {
    this.authService.logout();
    this.messageService.add({ severity: 'success', summary: 'Wylogowano', detail: 'Wylogowano pomyślnie', life: 3000 });
    this.router.navigate(['/login']);
  }
}
