import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { CommonServices } from 'src/app/services/common.services';
import { CovidVideoDialogComponent } from '../covid-video-dialog/covid-video-dialog.component';

@Component({
  selector: 'app-covid-current-reports',
  templateUrl: './covid-current-reports.component.html',
  styleUrls: ['./covid-current-reports.component.scss']
})
export class CovidCurrentReportsComponent implements OnInit {
  @Input() covidList:any = [];
  @Input() totalSize = 0;
  @Input() showPagination : boolean = true;
  public displayedColumns = ['date','time','location','image'];
  @Output() onPageChange: EventEmitter<any> = new EventEmitter();
  windowOPen:boolean
  public pageSize = 25;
  public currentPage = 0;

  constructor(private domSanitizer: DomSanitizer,private commonService: CommonServices,
    public dialog: MatDialog) {

   }

  ngOnInit() {
  }

  sanitizeURl(imgUrl:string){
    return this.domSanitizer.bypassSecurityTrustUrl(imgUrl);
  }

  changePage(event){
    let pageObj = {};
    pageObj = {
      'page_no':event.pageIndex,
      'limit':event.pageSize
    }
    this.onPageChange.emit(pageObj);
  }

 


  openVideoDialog(elem): void {
    let dialogRef = this.dialog.open(CovidVideoDialogComponent, {
      data: elem,
      width: '38%',
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
