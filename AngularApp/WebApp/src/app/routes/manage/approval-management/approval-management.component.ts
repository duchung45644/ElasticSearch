import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-approval-management',
    templateUrl: './approval-management.component.html',
})
export class ApprovalManagementComponent implements OnInit {
    status = 2;

    constructor() {}

    ngOnInit(): void {}

    tabChanged($event) {
        if ($event.tab.textLabel == 'Phê duyệt - Từ chối') {
            this.status = 2;
        } else if ($event.tab.textLabel == 'Mượn - Trả - Gia hạn') {
            this.status = 3;
        } else if ($event.tab.textLabel == 'Danh sách phiếu mượn') {
            this.status = 4;
        } else if ($event.tab.textLabel == 'Lịch sử trả hồ sơ') {
            this.status = 5;
        }
    }
}
