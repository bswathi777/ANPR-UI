import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, PageEvent } from '@angular/material';
import { Router } from '@angular/router';
import { CommonServices } from 'src/app/services/common.services';
import { GlobalServices } from 'src/app/services/global.service';
export interface PeriodicElement {
  
   id: number;
  TEST_NAME: string;
  TEST_RECORDS: number;
  PRICE_PER_RECORD: number;
  TEST_PRICE: number;
  
}





@Component({
  selector: 'app-digi-lab',
  templateUrl: './digi-lab.component.html',
  styleUrls: ['./digi-lab.component.scss']
})
export class DigiLabComponent implements OnInit {

  myForm: FormGroup;
  arr: FormArray;
items: FormArray;
  testModal:any = {}
  display:boolean 
  price:any
  test_name:any
  testsData:any
  price_per_record:any
  data: any = {};
  length:any
  testsArry= []
   //pagination and api integration starts from here
   
  public pageSize = 25;
  public currentPage = 0;
  public totalSize = 0;
  pageSizeOptions: number[];
  testid:any

  displayedColumns: string[] = [ 'id','TEST_NAME', 'TEST_RECORDS','PRICE_PER_RECORD', 'TEST_PRICE'];
 
 
test_names = [
  'ECG','BLOOD','DIABETES','THYROID','GENERAL CHECKUP','XRAY','EYE CARE','FITNESS CHECKUP','OBESITY','MRI'
]

  constructor(public _dialog: MatDialog,
     private commonService:CommonServices, 
     private router:Router,
     private fb: FormBuilder,
     private globalService:GlobalServices ) { 
    this.pageSizeOptions = this.globalService.pageSizeOptions;
  }

  ngOnInit() {
    // this.getTests(1);
    this.myForm = this.fb.group({
      arr: this.fb.array([this.createItem()])
    })
  }
 


  createItem() {
    return this.fb.group({
      test_name: [''],
      no_of_records: ['']
    })
  }

  addItem() {
    this.arr = this.myForm.get('arr') as FormArray;
    
    this.arr.reset()
    const temp =  []
      temp.forEach(item =>{
        this.arr.push( this.fb.group({
          test_name: item.test_name,
          no_of_records: item.no,
          PRICE_PER_RECORD: 0,
          TEST_PRICE:0

        }));

      })
  }


  removetest(index) {
    this.testid = index
    console.log(index,"kjhuvg");
    
    this.arr = this.myForm.get('arr') as FormArray;
    this.arr.removeAt(this.testid);
   
  }




  selectedTest(info) {
    this.test_name = info


  }
//   CalculatePrice(form:NgForm){
    
// let obj = {
//   test_name:this.test_name,
//   no_of_records:this.testModal.no_of_records,
// }
// console.log(obj,"objVal");

// this.testsArry.push(obj)
// console.log(this.testsArry);
// this.test_name = ''
// this.testModal = {}
// this.commonService.getPrice(obj).subscribe((res:any)=>{

// this.price = res['price'],
// this.price_per_record = res['price_per_record']
  
// })
//   }

  // deleteTest(info){
  //   this.data=info
  //   console.log(info);
  //   this.testsArry.splice(this.data, 1);
  // }
  onSubmit() {
    console.log(this.myForm.value);

  }

  createtestModal(contentModal){
    const dialogRef = this._dialog.open(contentModal, {
      width: '50rem',
      data: {},
    });
  }

  // OnSubmit(form1:NgForm){
   
  //   let data= {
  //     test_name:this.test_name,
  //     no_of_records:this.testModal.no_of_records,
  //     price:this.price,
  //     price_per_record:this.price_per_record,
  //   }
  //   this.commonService.CreateTest(data).subscribe((res:any)=>{
  
  //     this.getTests(1);
  //     this.testModal = {}
  //     this.test_name = ''
  //    this.price = ''
  //   })
  // }



  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  



// getTests(event){

// console.log(event,'getTestseefefe');

    
//   let size;
//   let offset;
//   if (event.pageSize != undefined) {
//     size = event.pageSize;
//     offset = event.pageIndex + 1;
//   }
//   else {
//     size = 25;
//     offset = 1;
//   }

//   let obj = {
   
//     "items_per_page": size,
//     "page_id": offset
//   };

//   this.commonService.getTests(obj).subscribe((res:any)=>{
//     this.length = res['test_price_count']
//     console.log(  this.length,"  this.length");
    
//     this.testsData = res['data']
//     console.log( this.testsData," this.testsData");

//   })
// }

}
