import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { LogComponent } from './log/log.component';
import { AccessmonitorComponent } from './accessmonitor/accessmonitor.component';
import { ManageRoutingModule } from './manage-routing.module';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { ShelfComponent } from './shelf/shelf.component';
import { CreateShelfComponent } from './shelf/shelf-form.component';

import { FondComponent } from './fond/fond.component';
import { CreateFondComponent } from './fond/fond-form.component';
import { RecordComponent } from './record/record.component';
import { CreateRecordComponent } from './record/record-form.component';
import { RecordDetailComponent } from './record/record-detailform.component';
import { RecordViewComponent } from './record/record-viewform.component';
import { CreateDocumentArchiveComponent } from './documentarchive/documentarchive-form.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { CreateBoxComponent } from './shelf/box-form.component';
import { ApproveComponent } from './approve/approve.component';

import { CreateApproveComponent } from './approve/approve-form.component';
import { CreateDeleteRecordsComponent } from './approve/delete-form.component';

// import { ViewApproveComponent } from './approve/view-canceledapprove.component';
import { BorrowmanageComponent } from './borrowmanage/borrowmanage.component';
// import { RegistrasionlistComponent } from './borrowmanage/registrasionlist/registrasionlist.component';

import { CreateRegistrasionlistComponent } from './borrowmanage/registrasionlist/registrasionlist-form.component';
import { CreateRenewalprofileComponent } from './borrowmanage/renewalprofile/renewalprofile-form.component.';
import { VoteslistComponent } from './borrowmanage/voteslist/voteslist.component';
import { CreateViewListComponent } from './borrowmanage/list/view-list-form.component';
import { CreateRefuseComponent } from './approve/refuse-form.component';
import { ViewApproveComponent } from './approve/view-canceledapprove.component';
import { ViewRefuseComponent } from './approve/view-refuse.component';
import { ViewRecordComponent } from './approve/view-record.component';
import { CreateAddinformationComponent } from './borrowmanage/list/addinformation-form.component';
import { CreateShowAllComponent } from './borrowmanage/list/showAll-form.component';
import { CreateDocumentArchivesViewComponent } from './borrowmanage/list/documentArchivesView-form.component';
import { CreateDocofrequestComponent } from './borrowmanage/docofrequest/docofrequest-form.component';
import { ViewFormComponent } from './record/view-form.component';
import { ViewDocumentArchiveComponent } from './documentarchive/view-documentarchive.component';

import { UnaffectedComponent } from './unaffected/unaffected.component';
import { CreateUnaffectedComponent } from './unaffected/unaffected-form.component';
import { RenewalprofileComponent } from './borrowmanage/renewalprofile/renewalprofile.component';
import { RegistrasionlistComponent } from './borrowmanage/registrasionlist/registrasionlist.component';
import { ListComponent } from './borrowmanage/list/list.component';
import { ApprovalManagementComponent } from './approval-management/approval-management.component';
import { BorrowSlipListComponent } from './approval-management/borrow-slip-list/borrow-slip-list.component';
import { BorrowReturnExtendDocumentComponent } from './approval-management/borrow-return-extend-document/borrow-return-extend-document.component';
import { DocumentReturnHistoryComponent } from './approval-management/document-return-history/document-return-history.component';
import { FormsModule } from '@angular/forms';
import { AcceptBorrowSlip } from './approval-management/approval-refuse/accept-borrow-slip';
import { ViewDetails } from './approval-management/borrow-slip-list/view-details';
import { ViewDetailsHistory } from './approval-management/document-return-history/view-details';

import { DetailsBorrowSlip } from './approval-management/borrow-return-extend-document/details-borrow-slip';
import { AddBorrowerInfor } from './approval-management/borrow-return-extend-document/add-borrower-infor';
import { ExtendBorrowSlip } from './approval-management/borrow-return-extend-document/extend-borrow-slip';
import { ReturnDocument } from './approval-management/borrow-return-extend-document/return-document';
import { DetailsDocument } from './documentarchive/details-document';
import { ApprovalRefuseComponent } from './approval-management/approval-refuse/approval-refuse.component';
import { ViewListRecordComponent } from './classification/viewlistrecord.component';
import { ViewDetailRecordComponent } from './classification/viewdetailrecord.component';
import { ApproveEditComponent } from './approve/approveedit.component';
import { DialogoConfirmacionComponent } from './dialogo-confirmacion/dialogo-confirmacion.component';
import { ClassificationComponent } from './classification/classification.component';

const COMPONENTS = [
    LogComponent,
    AccessmonitorComponent,
    FondComponent,
    RecordComponent,
    WarehouseComponent,
    ShelfComponent,
    RecordViewComponent,
    ApproveComponent,
    BorrowmanageComponent,
    RegistrasionlistComponent,
    RecordComponent,
    RecordDetailComponent,
    RecordViewComponent,
    VoteslistComponent,
    UnaffectedComponent,
    RenewalprofileComponent,
    ListComponent,
    // LogbookborrowedComponent,
    WarehouseComponent,
    ShelfComponent,
    RecordViewComponent,
    ApproveComponent,
    RecordComponent,
    RecordDetailComponent,
    RecordViewComponent,
    VoteslistComponent,
    CreateDocumentArchivesViewComponent,
    ApprovalManagementComponent,
    BorrowReturnExtendDocumentComponent,
    DocumentReturnHistoryComponent,
];

const COMPONENTS_DYNAMIC = [
    CreateFondComponent,
    CreateApproveComponent,
    CreateDeleteRecordsComponent,
    CreateShelfComponent,
    CreateRecordComponent,
    RecordDetailComponent,
    CreateDocumentArchiveComponent,
    CreateBoxComponent,
    CreateRegistrasionlistComponent,
    CreateRenewalprofileComponent,
    CreateViewListComponent,
    ViewApproveComponent,
    CreateRefuseComponent,
    ViewFormComponent,
    ViewDocumentArchiveComponent,
    CreateUnaffectedComponent,
    ViewApproveComponent,
    ViewRefuseComponent,
    CreateRefuseComponent,
    ViewRecordComponent,
    CreateShowAllComponent,
    CreateAddinformationComponent,
    CreateDocofrequestComponent,
    // duchung
    BorrowSlipListComponent,
    AcceptBorrowSlip,
    DetailsBorrowSlip,
    AddBorrowerInfor,
    ExtendBorrowSlip,
    ReturnDocument,
    ViewDetails,
    DetailsDocument,
    ViewDetailsHistory,
    ViewListRecordComponent,
    ViewDetailRecordComponent,
    ApproveEditComponent,
];

@NgModule({
    imports: [SharedModule, ManageRoutingModule, PdfViewerModule, FormsModule],
    declarations: [
        ...COMPONENTS,
        ...COMPONENTS_DYNAMIC,
        ApprovalRefuseComponent,
        DialogoConfirmacionComponent,
        ClassificationComponent,
    ],
    entryComponents: COMPONENTS_DYNAMIC,
})
export class ManageModule {}
