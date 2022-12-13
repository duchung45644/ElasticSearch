import { ClassificationComponent } from './classification/classification.component';
import { UnaffectedComponent } from './unaffected/unaffected.component';

//import { UnaffectedComponent } from './unaffected/unaffected.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccessmonitorComponent } from './accessmonitor/accessmonitor.component';

import { ApproveComponent } from './approve/approve.component';
import { FondComponent } from './fond/fond.component';
// import { BorrowrequestComponent } from './BorrowRequest/borrowrequest.component';
import { BorrowmanageComponent } from './borrowmanage/borrowmanage.component';

//import { RenewalprofileComponent } from './borrowmanage/renewalprofile/renewalprofile.component';
import { Docofrequest } from 'app/models/Docofrequest';
import { LogComponent } from './log/log.component';
import { RecordDetailComponent } from './record/record-detailform.component';
import { CreateRecordComponent } from './record/record-form.component';
import { RecordComponent } from './record/record.component';
import { ShelfComponent } from './shelf/shelf.component';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { ApprovalManagementComponent } from './approval-management/approval-management.component';
const routes: Routes = [
    { path: 'accessmonitor', component: AccessmonitorComponent, data: { title: 'Quản lý quyền truy cập' } },
    { path: 'log', component: LogComponent, data: { title: 'Quản lý lỗi' } },
    // // { path: 'receptiondossier', component: ReceptiondossierComponent, data: { title: 'Quản lý hồ sơ điện tử' } },
    // // { path: 'resultdossier', component: ResultdossierComponent, data: { title: 'Quản lý kết quả trả về TTHC' } },
    // // { path: 'applicants', component: ApplicantsComponent, data: { title: 'Quản lý hồ sơ điện tử' } },
    { path: 'record', component: RecordComponent, data: { title: 'Quản lý hồ sơ lưu trữ' } },
    { path: 'record-form/:id', component: CreateRecordComponent, data: { title: 'Thêm mới hồ sơ lưu trữ' } },
    { path: 'record-detailform/:id', component: RecordDetailComponent, data: { title: 'Thêm mới hồ sơ lưu trữ' } },
    { path: 'warehouse', component: WarehouseComponent, data: { title: 'Quản lý kho' } },
    { path: 'shelf', component: ShelfComponent, data: { title: 'Quản lý kệ' } },
    { path: 'approve', component: ApproveComponent, data: { title: 'Quản lý đợt hủy' } },
    { path: 'approve/:id', component: ApproveComponent, data: { title: 'Quản lý kệ' } },
    { path: 'borrowmanage', component: BorrowmanageComponent, data: { title: '' } },
    { path: 'unaffected', component: UnaffectedComponent, data: { title: '' } },
    // { path: 'unaffected', component: UnaffectedComponent, data: { title: '' } },
    { path: 'approvalmanagement', component: ApprovalManagementComponent, data: { title: 'quản lý phê duyệt' } },
    { path: 'fond', component: FondComponent, data: { title: '' } },
    { path: 'classification', component: ClassificationComponent, data: { title: '' } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ManageRoutingModule {}
