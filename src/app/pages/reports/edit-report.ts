import { GlobalServices } from './../../services/global.service';
import { CommonServices } from './../../services/common.services';
import { EventEmitter, Component, Input, Output, Optional, Host, OnInit } from '@angular/core';
import { SatPopover } from '@ncstate/sat-popover';

@Component({
  selector: 'edit-form',
  styleUrls: ['edit-report.css'],
  // (ngSubmit)="onSubmit()"
  template: `
  <div class="content">
  <form class="example-form" (ngSubmit)="onSubmit()" >
    <div class="mat-subheading-2">Update</div>  
      <mat-form-field>
        <input type="text" name="vehicle_reg_no" placeholder="Vehicle Reg No." matInput [(ngModel)]="module.vehicle_reg_no" autocomplete="off" oninput="this.value = this.value.toUpperCase()">
      </mat-form-field>
      <mat-form-field>
        <mat-label>Vehicle Type</mat-label>
        <mat-select name="vehicle" [(ngModel)]="module.vehicle">
          <mat-option *ngFor="let list of vehicletype" [value]="list.value">
            {{list.viewValue}} 
          </mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field>
        <mat-label>Vehicle Status</mat-label>
        <mat-select name="vehicle_status" [(ngModel)]="module.vehicle_status">
          <mat-option *ngFor="let list of status" [value]="list.value">
            {{list.viewValue}} 
          </mat-option>
        </mat-select>
      </mat-form-field>
    <div class="actions" fxLayout="row" fxLayoutAlign="space-between center">
    <button mat-button type="submit" color="primary" style="background-color:#bdbdbd;color:rgba(0, 0, 0, 0.87);">UPDATE <mat-spinner [diameter]="24" *ngIf="onSubmitLoading" style="float:right; margin: 5px 0px 0px 5px" ></mat-spinner></button>
      <button mat-button type="button" color="primary" style="background-color:#f44336;color:#fff" (click)="onCancel()">CANCEL</button>
    </div>
  </form>
  </div>
  `
})
export class EditForm implements OnInit {

  @Input() status_conf: JSON;

 @Output() update = new EventEmitter<string>();

  onSubmitLoading: boolean;

  status: any[] = [
    { value: 'entry', viewValue: 'Entry', icon: 'arrow_downward' },
    { value: 'exit', viewValue: 'Exit', icon: 'arrow_upward' }
  ];

  vehicletype: any[] = [
    { value: 'bike', viewValue: 'Bike' },
    { value: 'car', viewValue: 'Car' }
  ];

  module: any = {};

  status_data: string;
  oldItemData: any;

  constructor(@Optional() @Host() public popover: SatPopover, private commonService: CommonServices, public globalService: GlobalServices) {

  }

  ngOnInit() {
    this.module = this.status_conf;
    this.module.vehicle_reg_no = this.module.vehicle_reg_no.toUpperCase( )
    this.oldItemData = JSON.parse(JSON.stringify(this.module));
    //console.log(this.data)
  }

  onSubmit() {
    this.getEditReport(this.module);
  }

  getEditReport(data) {
    this.onSubmitLoading = true;
    let obj = {
      "vehicle_image": data.vehicle_image,
      "vehicle_status": data.vehicle_status,
      "vehicle_reg_no": data.vehicle_reg_no,
      "vehicle_type": data.vehicle
    }

    console.log(obj);

    this.commonService.editReportID(obj).subscribe(res => {
      if (res['success'] == '1') {

        this.globalService.showSuccessMessage(res['message']);
        if (this.popover) {
          this.popover.close("success");
        }

      } else if (res['success'] == '0') {
        this.globalService.showMessage(res['message']);
      }
      this.onSubmitLoading = false;
    },
      err => {
        console.log(err);
        this.onSubmitLoading = false;
      });
  }


  onCancel() {
    this.module.vehicle_reg_no= this.oldItemData.vehicle_reg_no
    this.module.vehicle= this.oldItemData.vehicle
    this.module.vehicle_status= this.oldItemData.vehicle_status
    if (this.popover) {
      this.popover.close();
    }
  }
}