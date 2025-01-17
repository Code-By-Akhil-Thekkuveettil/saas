import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
imports: [    RouterModule,  ]

@Component({
  selector: 'app-panel-distribution',
  templateUrl: './panel-distribution.component.html',
  styleUrls: ['./panel-distribution.component.css']
})
export class PanelDistributionComponent implements OnInit {

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
