import { GlobalServices } from './../../../services/global.service';
import { CommonServices } from './../../../services/common.services';
import { Company } from './../company.model';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-uploadlogo',
  templateUrl: './uploadlogo.component.html',
  styleUrls: ['./uploadlogo.component.scss']
})
export class UploadLogoDialogComponent implements OnInit {

  fileToUpload: File = null;

  constructor(public dialogRef: MatDialogRef<UploadLogoDialogComponent>, private globalServices: GlobalServices,
    @Inject(MAT_DIALOG_DATA) public data: any, private commonServices: CommonServices, private snackBar: MatSnackBar) {

    //console.log(data)


  }

  ngOnInit() {

  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);

  }

  setSave() {

    //console.log(this.fileToUpload)

    if(this.fileToUpload != null){

    let frmData = new FormData();
    frmData.append('file', this.fileToUpload);
    frmData.append('id', this.data.id);

    this.commonServices.uploadLogo(frmData).subscribe(res => {
      if (res['success'] == '1') {
        this.globalServices.showSuccessMessage(res['message']);
        this.dialogRef.close();
      } else if (res['success'] == '0') {
        this.globalServices.showErrorMessage(res['message'])

      }
    },
      err => {
        console.log(err);
    
      });

    }else{
      this.globalServices.showMessage("Select Image File");
    }

  }




  close(): void {
    this.dialogRef.close();
  }

}
