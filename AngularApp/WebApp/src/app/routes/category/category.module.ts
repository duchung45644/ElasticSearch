// import { NgModule } from '@angular/core';
// import { SharedModule } from '@shared/shared.module';
// import { CategoryRoutingModule } from '../category/category-routing.module';
// import { CommuneComponent } from '../category/commune/commune.component';
// import { CreateCommuneComponent } from '../category/commune/commune-form.component';
// import { CreateDistrictComponent } from '../category/district/district-form.component';
// import { DistrictComponent } from '../category/district/district.component';
// import { ProvinceComponent } from '../category/province/province.component';
// import { CreateProvinceComponent } from '../category/province/province-form.component';
// import { PositionComponent } from '../category/position/position.component';
// import { CreatePositionComponent } from '../category/position/position-form.component';
// import { AngularEditorModule } from '@kolkov/angular-editor';
// import { MessagecontentComponent } from '../category/message/message.component';

// import { CreateCategoriesComponent } from './categories/categories-form.component';
// import { CategoriesComponent } from './categories/categories.component';
// import { TreeviewModule } from 'ngx-treeview';
// import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
// import { CreateDynamicFormComponent } from './dynamic-form/create-dynamic-form.component';

// import { CategoryComponent } from './category/category.component';
// import { CreateCategoryComponent } from './category/category-form.component';
// import { ViewDynamicFormComponent } from './dynamic-form/view-dynamic-form.component';
// import { V2Component } from './v2/v2.component';
// import { CreateV2Component } from './v2/v2-form.component';
// import { CatalogComponent } from './catalog/catalog.component';
// import { CreateCatalogComponent } from './catalog/catalog-form.component';
// import { ConditionComponent } from './condition/condition.component';
// import { FieldsComponent } from './fields/fields.component';
// import { CreateFieldsComponent } from './fields/fields-form.component';
// import { CreateConditionComponent } from './condition/condition-form.component';
// import { RecordtypeComponent } from './recordtype/recordtype.component';
// import { CreateRecordTypeComponent } from './recordtype/recordtype-form.component';

// const COMPONENTS = [
//     CommuneComponent,
//     DistrictComponent,
//     ProvinceComponent,
//     PositionComponent,
//     MessagecontentComponent,
//     CategoriesComponent,
//     DynamicFormComponent,
//     CatalogComponent,
//     CategoryComponent,
//     V2Component,
//     FieldsComponent,
//     ConditionComponent,
// ];
// const COMPONENTS_DYNAMIC = [
//     CreateCategoriesComponent,
//     CreateDynamicFormComponent,
//     ViewDynamicFormComponent,
//     CreateCategoryComponent,
//     CreateCatalogComponent,
//     CreateV2Component,
//     CreateFieldsComponent,
//     CreateConditionComponent,
//     RecordtypeComponent,
//     CreateRecordTypeComponent,
// ];

// @NgModule({
//     imports: [SharedModule],
//     declarations: [...COMPONENTS, ...COMPONENTS_DYNAMIC],
//     entryComponents: COMPONENTS_DYNAMIC,
// })
// export class CategoryModule {}
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { CategoryRoutingModule } from '../category/category-routing.module';
import { CommuneComponent } from '../category/commune/commune.component';
import { CreateCommuneComponent } from '../category/commune/commune-form.component';
import { CreateDistrictComponent } from '../category/district/district-form.component';
import { DistrictComponent } from '../category/district/district.component';
import { ProvinceComponent } from '../category/province/province.component';
import { CreateProvinceComponent } from '../category/province/province-form.component';
import { PositionComponent } from '../category/position/position.component';
import { CreatePositionComponent } from '../category/position/position-form.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { MessagecontentComponent } from '../category/message/message.component';

import { CreateCategoriesComponent } from './categories/categories-form.component';
import { CategoriesComponent } from './categories/categories.component';
import { TreeviewModule } from 'ngx-treeview';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { CreateDynamicFormComponent } from './dynamic-form/create-dynamic-form.component';

import { CategoryComponent } from './category/category.component';
import { CreateCategoryComponent } from './category/category-form.component';
import { ViewDynamicFormComponent } from './dynamic-form/view-dynamic-form.component';
import { V2Component } from './v2/v2.component';
import { CreateV2Component } from './v2/v2-form.component';
import { CatalogComponent } from './catalog/catalog.component';
import { CreateCatalogComponent } from './catalog/catalog-form.component';
import { FieldsComponent } from './fields/fields.component';
import { CreateFieldsComponent } from './fields/fields-form.component';
import { ConditionComponent } from './condition/condition.component';
import { CreateConditionComponent } from './condition/condition-form.component';
import { RecordtypeComponent } from './recordtype/recordtype.component';
import { CreateRecordTypeComponent } from './recordtype/recordtype-form.component';

const COMPONENTS = [
    CommuneComponent,
    DistrictComponent,
    ProvinceComponent,
    PositionComponent,
    MessagecontentComponent,
    CategoriesComponent,
    DynamicFormComponent,
    CatalogComponent,
    CategoryComponent,
    V2Component,
];
const COMPONENTS_DYNAMIC = [
    CreateCommuneComponent,
    CreateDistrictComponent,
    CreateProvinceComponent,
    CreatePositionComponent,
    CreateFieldsComponent,
    CreateConditionComponent,
    CreateRecordTypeComponent,

    CreateCategoriesComponent,
    CreateDynamicFormComponent,
    ViewDynamicFormComponent,
    CreateCategoryComponent,
    CreateCatalogComponent,
    CreateV2Component,
];

@NgModule({
    imports: [SharedModule, CategoryRoutingModule, AngularEditorModule, TreeviewModule],
    declarations: [
        ...COMPONENTS,
        ...COMPONENTS_DYNAMIC,
        DynamicFormComponent,
        FieldsComponent,
        ConditionComponent,
        RecordtypeComponent,
    ],
    entryComponents: COMPONENTS_DYNAMIC,
})
export class CategoryModule {}
