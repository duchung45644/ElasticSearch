import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType } from '@ngx-formly/material/form-field';

import { FieldArrayType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-combobox',
  template: `<div class="formly-field-combobox-container-click-fix" (click)="select.open()">
    <mtx-select
      #select
      [formControl]="formControl"
      [items]="to.options | toObservable | async"
      [bindLabel]="to.labelProp"
      [bindValue]="bindValue"
      [multiple]="to.multiple"
      [placeholder]="to.placeholder"
      [required]="to.required"
      [closeOnSelect]="!to.multiple"
    >
    </mtx-select>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldComboboxComponent extends FieldType {
  get bindValue() {
    return typeof this.to.valueProp === 'string' ? this.to.valueProp : undefined;
  }
}




@Component({
  selector: 'formly-array-type',
  template: `
  <div class="mb-3">
    <legend *ngIf="to.label">{{ to.label }}</legend>
    <p *ngIf="to.description">{{ to.description }}</p>

    <div class="alert alert-danger" role="alert" *ngIf="showError && formControl.errors">
      <formly-validation-message [field]="field"></formly-validation-message>
    </div>

    <div *ngFor="let field of field.fieldGroup;let i = index;" class="row align-items-center">
      <formly-field class="col" [field]="field"></formly-field>
      <div *ngIf="field.templateOptions.removable !== false" class="col-2 text-right">
        <button class="btn btn-danger" type="button" (click)="remove(i)">-</button>
      </div>
    </div>

    <div class="d-flex flex-row-reverse">
      <button class="btn btn-primary" type="button" (click)="add()">+</button>
    </div>
  </div>
  `,
})
export class ArrayTypeComponent extends FieldArrayType { }


@Component({
  selector: 'formly-object-type',
  template: `
      <div class="mb-3">
        <legend style="font-weight: 400;text-decoration: underline;" *ngIf="to.label">{{ to.label }}</legend>
        <p *ngIf="to.description">{{ to.description }}</p>
        <div class="alert alert-danger" role="alert" *ngIf="showError && formControl.errors">
          <formly-validation-message [field]="field"></formly-validation-message>
        </div>
        <div [class]="field.fieldGroupClassName">
        <formly-field    *ngFor="let f of field.fieldGroup" [field]="f"></formly-field>
        </div>
        </div>
  `,
})
export class ObjectTypeComponent extends FieldType { }


@Component({
  selector: 'formly-multi-schema-type',
  template: `
    <div class="card mb-3">
      <div class="card-body">
        <legend *ngIf="to.label">{{ to.label }}</legend>
        <p *ngIf="to.description">{{ to.description }}</p>
        <div class="alert alert-danger" role="alert" *ngIf="showError && formControl.errors">
          <formly-validation-message [field]="field"></formly-validation-message>
        </div>
        <formly-field *ngFor="let f of field.fieldGroup" [field]="f"></formly-field>
      </div>
    </div>
  `,
})
export class MultiSchemaTypeComponent extends FieldType { }


@Component({
  selector: 'formly-null-type',
  template: '',
})
export class NullTypeComponent extends FieldType { }

