import { CommonServices } from './../../../services/common.services';
import { GlobalServices } from './../../../services/global.service';
import { Company } from './../company.model';
import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatCheckboxChange } from '@angular/material';
import { NgForm, FormControl, FormGroup, FormBuilder, Validators, NgModel } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

// export interface User {
//   employee_id: number;
//   usename: any;
//   work_email: any;
// }

@Component({
  selector: 'app-camera-access-dialog',
  templateUrl: './camera-access-dialog.component.html',
  styleUrls: ['./camera-access-dialog.component.scss']
})
export class CameraAccessDialogComponent implements OnInit {
  @Input() model: NgModel;
  @Input() value: any[] = [];
  public overallRes;
  users: Observable<any[]>;
  toppings = new FormControl();
  cameraControl = new FormControl();
  cameras = new FormControl();
  //myControl = new FormControl();
  //toppingList: string[] = ['Greenko CyberTowers', 'Greenko CyberGateway', 'Greenko36', 'Greenko45', 'Greenko44'];
  //cameraList: string[] = ['Camera1', 'Camera2', 'Camera3', 'Camera4'];
  //options: string[] = ['User1', 'User2', 'User3'];
  employee_id: number;
  camera_id: any;
  username: any;
  work_email: any;
  company_name: string;
  company_location: any;
  camera_location: string;
  lat: any;
  long: any;
  options: any = [];
  total: any;
  error_msg: string = "Loading";
  companyLists: any = [];
  cameraLists: any = [];
  company_id: string;
  data: any = {};
  bol_user: boolean = true;
  bol_companies: boolean = true;
  bol_camera: boolean = true;
  dataObj = {};
  public selectedUserId;
  selectall: boolean;

  myControl = new FormControl(null, [
    Validators.required,
  ]);

  constructor(
    public dialogRef: MatDialogRef<CameraAccessDialogComponent>,
    private commonServices: CommonServices,
    private globalService: GlobalServices,
    private _router: Router,
    public route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.getCompanyData();
   // this.companyData(null);
    this.getCameraCompany();
    this.selectall = false;
  }

  ngOnInit() {
    if (this.data) {
      this.data;
    }
    else {
      this.data = new Company();
    }
    this.users = this.myControl.valueChanges.pipe(startWith(''), map(value => this._filter(value))
  );
  // this.dataObj = {
  //   'camera_ids': this.data.camera_id
  // }
  }
  addCameraForm(form: NgForm) {
    // this.data['user_id'] = this.employee_id;
    // this.data['company_ids'] = this.company_name;
    // this.data['camera_ids'] = this.camera_location;
    // //console.log(this.data)
    // let obj = {
    //   // 'user_id': this.data.employee_id,
    //   // 'company_ids': this.data.company_name,
    //   // 'camera_ids': this.data.camera_location
    //   data: this.data
    // };
    // this.commonServices.userCompanies(obj).subscribe(
    //   res => {
    //     if (res['success'] == 1) {
    //      // this.cameraLists = res['data'];
    //      this.snackBar.open(res["message"], "close", {
    //       duration: 2000,
    //     });
    //     this.dialogRef.close();
    //         console.log(res['data'])
    //     } else {
    //       this.snackBar.open(res["message"], "close", {
    //         duration: 2000,
    //       });
    //         //this.globalService.showSuccessMessage(res['message']);
    //          console.log(res['data'])
    //       //this.cameraLists = [];
    //     }
    //   },
    //   err => {
    //     console.log(err);
    //   });

  }
  private _filter(value: any): any [] {
    console.log(value);
    // const filterValue = value.usename.toLowerCase();
    const filterValue = value.toLowerCase();
    if(this.options.length>0){
      this.selectedUserId = this.options.find(option => option.usename.toLowerCase().includes(filterValue)
      || option.work_email.toLowerCase().includes(filterValue)).employee_id;
      console.log(this.selectedUserId);
      return this.options.filter(option => option.usename.toLowerCase().includes(filterValue)
      || option.work_email.toLowerCase().includes(filterValue));
    }
 }

 displayFn(user) {
  //  console.log(user);
  return user;
}

 dataChanged(newObj) {
   console.log(newObj);
  if (newObj.length > 2) {
  let obj = {
    'username_given': newObj || '',
  };
  this.commonServices.getUserlists(obj).subscribe(
    res => {
      console.log(res);
      if (res['success'] == 1) {
        this.options = res['data'];
      }else{
        this.options = res ['data'];
      }
    },
    err => {
      console.log(err);
    });
  }
}

public getCameraCompany() {
  this.commonServices.getCameraCompany({}).subscribe(
    res => {
      if (res['success'] == 1) {
        this.cameraLists = res['data'];
      }
    },
    err => {
      console.log(err);
    });
}
 public getCompanyData() {
  this.commonServices.getCompanyData({}).subscribe(
    res => {
      if (res['success'] == 1) {
        this.companyLists = res['data'];
      }
    },
    err => {
      console.log(err);
    });
}

 public companyData(data) {
  console.log('message',data)
  let obj = {
    'company_id': this.data.company_name,
  }
  console.log('show service', this.data);
  this.commonServices.getCameraCompany(obj).subscribe(
    res => {
      console.log('res', res);
      if (res['success'] == 1) {
        this.cameraLists = res['data'];
        console.log(res['data'])
      } else {
        this.cameraLists = [];
      }
    },
    err => {
      console.log(err);
    });
}

  insertUserCompany(data){
    let obj;
    // console.log(this.users.find(user=>user.usename==this.data.username))
    if(this.data.camera_location == undefined){
      obj = {
      'user_id': this.selectedUserId,//2128,
      'company_ids': this.data.company_name.join(','),
      'camera_ids': '0',
    }
  }
  else{
     obj = {
    'user_id': this.selectedUserId,//2128,
    'company_ids': this.data.company_name.join(','),
    'camera_ids': this.data.camera_location.join(','),
    }
  }
     this.commonServices.userCompanies(obj).subscribe(
       res => {
         if (res['success'] == 1) {
        //   this.snackBar.open(res["message"], "close", {
        //    duration: 2000,
        //  });
        this.globalService.showSuccessMessage(res['message']);
         this.dialogRef.close();
         }else {
          this.globalService.showMessage(res['message']);
             //this.globalService.showSuccessMessage(res['message']);
            //console.log(res['data'])
         }
       },
       err => {
         console.log(err);
       });
  }
  close(): void {
    this.dialogRef.close();
  }

   setAllCameras(change: MatCheckboxChange){
     console.log(change);
    if (change.checked) {
      // this.model.update.emit(this.value);
      this.data.camera_location = this.cameraLists.map(camera=>camera.id);
    } else {
      // this.model.update.emit([]);
      this.data.camera_location=[];
    }
  }
   /* setAllCompany(change: MatCheckboxChange){
    console.log(change);
   if (change.checked) {
     this.data.company_name = this.companyLists.map(company=>company.id);
     this.companyData('');
    } else {
     this.data.company_name=[];
   }
    // console.log(this.data);
    // this.camera_id = event.checked;
    // this.dataObj = {
    //    'camera_ids': this.data.camera_id,
    // }
  } */
}
    // this.getReportdata(this.dataObj);
    //  console.log(element);
    //  this.cameraControl.setValue([this.companyLists.map(cids => {
    //    return cids.id
    //  })])
