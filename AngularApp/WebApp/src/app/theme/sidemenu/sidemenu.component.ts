import { Component, Input, ViewEncapsulation } from '@angular/core';
import { SettingsService } from '@core';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SidemenuComponent {
  // NOTE: Ripple effect make page flashing on mobile
  @Input() ripple = false;

  menus :any;

  constructor(private settings: SettingsService) {
    this.menus = settings.menus;
  }

  // Delete empty values and rebuild route
  buildRoute(routes: string[]) {
    let route = '';
    return routes[routes.length-1];
    routes.forEach(item => {
      if (item && item.trim()) {
        route += '/' + item.replace(/^\/+|\/+$/g, '');
      }
    });
    return route;
  }
}
