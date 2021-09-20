import { Component, OnInit, ViewChild, HostBinding, Input, Optional, ElementRef, ChangeDetectorRef, Self, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { MatFormFieldControl, MatAutocompleteTrigger } from '@angular/material';
import { FormControl, NgControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { FocusMonitor } from '@angular/cdk/a11y';
import { startWith } from 'rxjs/internal/operators/startWith';
import { map } from 'rxjs/operators';
import { CommonServices } from 'src/app/services/common.services';

export class ItemList {
  constructor(public employee_id: number, usename:string, work_email:string, public selected?: boolean) {
    if (selected === undefined) selected = false;
  }
}

@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss'],

  providers: [{ provide: MatFormFieldControl, useExisting: MultiSelectComponent }]
})
export class MultiSelectComponent implements OnInit {

  @ViewChild('inputTrigger', { read: MatAutocompleteTrigger, static: false }) inputTrigger: MatAutocompleteTrigger;
  itemControl = new FormControl();
  stateChanges = new Subject<void>();
  private _placeholder: string;
  static nextId = 0;
  @HostBinding() id = `input-ac-${MultiSelectComponent.nextId++}`;
  @HostBinding('attr.aria-describedby') describedBy = '';
  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }
  @Input() set value(value: any) {
    if (value) {
      this.selectedItems = value;
    }
    this.stateChanges.next();
  }
  @Input() emailInfo;
  get value() {
    return this.selectedItems;
  }
  // @Input()
  // get placeholder() {
  //   return this._placeholder;
  // }
  // set placeholder(plh) {
  //   this._placeholder = plh;
  //   this.stateChanges.next();
  // }
  private changeCallback: Function;
  private touchedCallback: Function;
  focused = false;
  isAllSelected = false;


  selectedItems: ItemList[] = new Array<ItemList>();
  @Output() emailInputString: EventEmitter<string> = new EventEmitter();
  // filteredItems: Observable<ItemList[]>;

  constructor(
    @Optional() @Self() public ngControl: NgControl,
    private fm: FocusMonitor,
    private elRef: ElementRef<HTMLElement>,
    private cd: ChangeDetectorRef,
    private commonService: CommonServices
  ) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
    fm.monitor(elRef.nativeElement, true).subscribe(origin => {
      this.focused = !!origin;
      this.stateChanges.next();
    });
  }

  writeValue(value: any) {
    console.log(value, 'Inside writeValue')
  }
  registerOnChange(fn: Function) {
    this.changeCallback = fn;
  }
  registerOnTouched(fn: Function) {
    this.touchedCallback = fn;
  }

  lastFilter = '';

  ngOnInit() {

  }
  clicker() {
    this.inputTrigger.openPanel();
  }

  optionClicked(event: Event, item: ItemList) {
    event.stopPropagation();
    this.toggleSelection(item);
  }

  emailSearch(emailString: string) {
    this.emailInputString.emit(emailString);
  }


  toggleSelection(item: ItemList) {
    item.selected = !item.selected;
    if (item.selected) {
      this.selectedItems.push(item);
      this.changeCallback(this.selectedItems);
    } else {
      const i = this.selectedItems.findIndex((value:ItemList) => value.employee_id === item.employee_id);
      this.selectedItems.splice(i, 1);
      this.changeCallback(this.selectedItems);
    }

  }

  removeSelection(item: ItemList) {
    const i = this.selectedItems.findIndex(value => value.employee_id === item.employee_id);
    this.selectedItems.splice(i, 1);
    this.changeCallback(this.selectedItems);
  }

  ngOnDestroy() {
    this.fm.stopMonitoring(this.elRef.nativeElement);
    this.stateChanges.complete();
  }

}
