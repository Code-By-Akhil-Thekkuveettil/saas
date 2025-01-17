import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { navbarData } from './nav-data';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  @Output() showNav = new EventEmitter();
  @Input() collapsed: boolean = false;
  navData = navbarData
  constructor() { }
  ngOnInit(): void {
    this.showNav.emit(this.collapsed);
  }
  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.showNav.emit(this.collapsed);
  }
  closeSidenav(): void {
    this.collapsed = false;
    this.showNav.emit(this.collapsed);
  }

}
