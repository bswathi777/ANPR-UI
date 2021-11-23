import { Component, OnInit, Optional, Input, Output, EventEmitter, Host } from '@angular/core';
import { SatPopover } from '@ncstate/sat-popover';
import { CommonServices } from '../services/common.services';
import { GlobalServices } from '../services/global.service';

@Component({
  selector: 'app-edit-comment',
  templateUrl: './edit-comment.component.html',
  styleUrls: ['./edit-comment.component.scss']
})
export class EditCommentComponent implements OnInit {

  @Input() status_conf: JSON;

  @Output() update_comment = new EventEmitter<string>();

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
  object: any;
  oldItemData: any;
  // object: any;

  constructor(@Optional() @Host() public popover: SatPopover, private commonService: CommonServices, public globalService: GlobalServices) {

  }

  ngOnInit() {
    this.module = this.status_conf;
    this.module.vehicle_reg_no = this.module.vehicle_reg_no.toUpperCase( )
    this.oldItemData = JSON.parse(JSON.stringify(this.module));
    console.log(this.module)
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


  onCancel(object) {
    console.log(object.vehicle_reg_no)
    this.module.vehicle_reg_no= this.oldItemData.vehicle_reg_no
     console.log(this.module.vehicle_reg_no,"expecting old value");
     
    if (this.popover) {
      this.popover.close();
    }
  }
}