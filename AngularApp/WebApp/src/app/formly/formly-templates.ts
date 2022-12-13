import { ViewChild, ChangeDetectionStrategy, Component, OnInit, AfterViewInit, AfterContentInit, AfterContentChecked, ChangeDetectorRef, AfterViewChecked  } from '@angular/core';
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
  selector: 'formly-object-type',
  template: `
      <div class="mb-3">
        <h2  style="font-weight: 400;text-decoration: underline;" *ngIf="to.label">{{ to.label }}</h2>
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

@Component({
  selector: 'formly-array-file',
  template: `
  <div class="array_file">
      <h4  style="font-weight: 400;text-decoration: underline;" *ngIf="to.label">{{ to.label }}
      </h4>
      
      <div class="alert alert-danger" role="alert" *ngIf="showError && formControl.errors">
        <formly-validation-message [field]="field"></formly-validation-message>
      </div>

      <table>
      <tr *ngFor="let field of field.fieldGroup;let i = index;" >
        <td>
          <formly-field class="colfield" [field]="field" ></formly-field>
        </td>
        <td style="width:30px"> 
            <div *ngIf="field.templateOptions.removable !== false" class="text-right">
            <button class="btn btn-danger" type="button" (click)="remove(i)">-</button>
          </div>
        </td>
      </tr>
      <tr>
      <td colspan="2" style="text-align: right;"><button class="btn btn-primary" type="button" (click)="add()">+</button></td>
    </table>
 
  </div>
  `
})
export class  ArrayFileComponent  extends FieldArrayType  {
   
 }


//==================================================================================================

@Component({
  selector: 'formly-null-type',
  template: '',
})
export class NullTypeComponent extends FieldType { }
//==================================================================================================

// // @Component({
// //   selector: 'formly-field-file',
// //   template: ` 
 
// //   `,changeDetection: ChangeDetectionStrategy.OnPush
// // })
// // export class FormlyFieldFile extends  FieldType {
// //   get bindValue() {
// //     return typeof this.to.valueProp === 'string' ? this.to.valueProp : undefined;
// //   }
// // }