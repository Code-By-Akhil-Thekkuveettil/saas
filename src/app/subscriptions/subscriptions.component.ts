import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.css']
})
export class SubscriptionsComponent implements OnInit {
  expNavbar: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

  expand(show) {
    this.expNavbar = show;
  }
}
