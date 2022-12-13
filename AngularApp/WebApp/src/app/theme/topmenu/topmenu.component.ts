import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SettingsService } from '@core';

@Component({
  selector: 'app-topmenu',
  host: {
    class: 'matero-topmenu',
  },
  templateUrl: './topmenu.component.html',
  styleUrls: ['./topmenu.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TopmenuComponent implements OnInit {
  menus :any;

  constructor(public setting: SettingsService) {}

  ngOnInit() {

this.menus = this.setting.menus;
  }

  // Delete empty values and rebuild route
  buildRoute(routes: string[]) {
    let route = '';
    routes.forEach(item => {
      if (item && item.trim()) {
        route += '/' + item.replace(/^\/+|\/+$/g, '');
      }
    });
    return route;
  }
}
