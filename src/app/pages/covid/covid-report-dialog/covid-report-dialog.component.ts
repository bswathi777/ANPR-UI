import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CommonServices } from 'src/app/services/common.services';

@Component({
  selector: 'app-covid-report-dialog',
  templateUrl: './covid-report-dialog.component.html',
  styleUrls: ['./covid-report-dialog.component.scss']
})
export class CovidReportDialogComponent implements OnInit {
  public f: FormGroup;
  public emailData;
  constructor(public dialogRef: MatDialogRef<CovidReportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public fb: FormBuilder,private commonService:CommonServices) {
  }

  ngOnInit() {
    this.f = this.fb.group({
      selectedEmail: ['']
    })
  }

  closeDialog() {
    this.dialogRef.close();
  }

  emailInputString(inputStr:string){
    let obj = {
      "username_given" : inputStr
    };
    this.commonService.getEmailForReports(obj).subscribe(emailRes=> {
      this.emailData = emailRes['data'];
    });
  }

  subs() {
    console.log(this.f.value);
  }

}
