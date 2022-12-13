import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '@core/bootstrap/settings.service';

@Component({
    selector: 'breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class BreadcrumbComponent implements OnInit {
    @Input() nav: string[] = [];

    constructor(private router: Router, private setting: SettingsService) {}

    ngOnInit() {
        this.nav = Array.isArray(this.nav) ? this.nav : [];

        if (this.nav.length === 0) {
            this.genBreadcrumb();
        }
    }

    trackByNavlink(index: number, navlink: string): string {
        return navlink;
    }

    genBreadcrumb() {
        const states = this.router.url.slice(1).split('/');
        this.nav = this.setting.getMenuLevelV2(this.router.url);
        this.nav.unshift('Trang Chủ');
    }
}
