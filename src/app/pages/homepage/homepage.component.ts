import { Component, OnInit } from '@angular/core';

import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  public data;

  constructor(
    private dashboardService: DashboardService,
  ) { }

  ngOnInit() {
    this.dashboardService.getHome().subscribe(ret => {
      this.data = ret;
    });
  }
}
