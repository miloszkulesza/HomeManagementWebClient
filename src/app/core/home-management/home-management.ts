import { Component, OnInit } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { MenuBar } from "./components/menu-bar/menu-bar";

@Component({
  selector: 'app-home-management',
  imports: [PanelModule, MenuBar],
  templateUrl: './home-management.html',
  styleUrl: './home-management.scss'
})
export class HomeManagement implements OnInit {
  email: string;
  token: string;

  ngOnInit() {
    this.email = localStorage.getItem('login');
    this.token = localStorage.getItem('token');
  }
}
