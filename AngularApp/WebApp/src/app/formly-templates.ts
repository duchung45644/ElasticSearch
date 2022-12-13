import { ViewChild, ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldType  } from '@ngx-formly/material/form-field';
import { MtxSelectComponent } from '@ng-matero/extensions/select';
import { FieldArrayType } from '@ngx-formly/core';

/**
 * This is just an example.
 */
@Component({
  selector: 'formly-field-combobox',
  template: `<mtx-select
    #select
    [formControl]="formControl"
    [items]="to.options | toObservable | async"
    [bindLabel]="to.labelProp"
    [bindValue]="bindValue!"
    [multiple]="to.multiple"
    [placeholder]="to.placeholder!"
    [required]="to.required!"
    [closeOnSelect]="!to.multiple"
    [compareWith]="to.compareWith"
  >
  </mtx-select>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldComboboxComponent extends FieldType {
  @ViewChild('select', { static: true }) select!: MtxSelectComponent;

  public formControl!: FormControl;

  get bindValue() {
    return typeof this.to.valueProp === 'string' ? this.to.valueProp : undefined;
  }

  // The original `onContainerClick` has been covered up in FieldType, so we should redefine it.
  onContainerClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (/mat-form-field|mtx-select/g.test(target.parentElement?.classList[0] || '')) {
      this.select.focus();
      this.select.open();
    }
  }
}

//==================================================================================================
 
@Component({
  selector: 'formly-repeat-section',
  template: `
  <div class="mb-3">
    <div *ngFor="let field of field.fieldGroup; let i = index;" class="row">
      <formly-field class="col" [field]="field"></formly-field>
      <div class="col-sm-2 d-flex align-items-center">
        <button class="btn btn-danger" type="button" (click)="remove(i)">Remove</button>
      </div>
    </div>
    <div style="margin:30px 0;">
      <button class="btn btn-primary" type="button" (click)="add()">{{ to.addText }}</button>
    </div>
    </div>
  `,
})
export class RepeatTypeComponent extends FieldArrayType {}
//==================================================================================================

@Component({
  selector: 'formly-array-type',
  template: `
  <div class="mb-3">
  <h2  style="font-weight: 400;text-decoration: underline;" *ngIf="to.label">{{ to.label }}</h2>
    <p *ngIf="to.description">{{ to.description }}</p>
    <div class="alert alert-danger" role="alert" *ngIf="showError && formControl.errors">
      <formly-validation-message [field]="field"></formly-validation-message>
    </div>
    
        <div *ngFor="let field of field.fieldGroup;let i = index;" class="row align-items-center">
          <formly-field class="col" [field]="field" ></formly-field>
          <div *ngIf="field.templateOptions.removable !== false" class="col-1 text-right" style="margin-top: -20px;">
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


//==================================================================================================

@Component({
  selector: 'formly-null-type',
  template: '',
})
export class NullTypeComponent extends FieldType { }
//==================================================================================================

// @Component({
//   selector: 'formly-field-file',
//   template: ` 
//     <input type="file" [formControl]="formControl" [formlyAttributes]="field">
//   `,changeDetection: ChangeDetectionStrategy.OnPush
// })
// export class FormlyFieldFile extends  FieldType {
//   get bindValue() {
//     return typeof this.to.valueProp === 'string' ? this.to.valueProp : undefined;
//   }
// }