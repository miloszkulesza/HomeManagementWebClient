import { Component, OnInit } from '@angular/core';
import { MenuBar } from "../menu-bar/menu-bar";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [MenuBar, 
    RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout implements OnInit {
  email: string;
  token: string;

  ngOnInit() {
    this.email = sessionStorage.getItem('login');
    this.token = sessionStorage.getItem('token');
  }
}
