import { Component, OnInit } from '@angular/core';
import { navbarData } from '../sidenav/nav-data';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  collapsed = true
  navData=navbarData
  constructor() { }

  ngOnInit(): void {
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
  }

  closeSidenav(): void {
    this.collapsed = false;
  }


}
