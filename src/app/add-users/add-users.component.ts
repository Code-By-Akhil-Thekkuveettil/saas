import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
imports: [    RouterModule,  ]

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.css']
})
export class AddUsersComponent implements OnInit {

  expNavbar: boolean = true;
  path!: string;
  tknPassed !: string;

  constructor() { }

  ngOnInit(): void {
  }

  expand(show) {
    this.expNavbar = show;
  }

}
