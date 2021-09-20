import { GlobalServices } from './../../../services/global.service';
import { CommonServices } from './../../../services/common.services';
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
import { MessagesService } from './messages.service';
import * as moment from 'moment';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [MessagesService]
})
export class MessagesComponent implements OnInit {
  @ViewChild(MatMenuTrigger, { static: false }) trigger: MatMenuTrigger;
  public selectedTab: number = 1;
  public messages: Array<Object>;
  public files: Array<Object>;
  public meetings: Array<Object>;

  notificationList: any[];
  emptyData: string;
  dataloading: boolean;
  show_datetime: boolean;
  constructor(private messagesService: MessagesService, private commonService: CommonServices,
    private globalService: GlobalServices, ) {
    this.messages = messagesService.getMessages();
    this.files = messagesService.getFiles();
    this.meetings = messagesService.getMeetings();

    let company_dataitem = JSON.parse(localStorage.getItem('company_dataitem'));
    let company_id = company_dataitem.id;

    this.getVehicleList(company_id);
  }

  ngOnInit() {
  }

  getVehicleList(company_id) {

    this.notificationList = [];

    let date = new Date();

    let dateFormat = moment(date).format('YYYY-MM-DD');

    let obj = {
      "company_id": company_id,
      "date": dateFormat
    };

    this.commonService.notificationList(obj).subscribe((res) => {
      if (res['success'] == 1) {

        this.notificationList = res["data"]; 

        if (this.notificationList.length == 0) {
          this.dataloading = false;
        } else {
          this.dataloading = true;
        }


      }
      else {

        this.dataloading = false;
        this.globalService.showErrorMessage(res['message'])
      }
    },
      (err) => {
        this.dataloading = false;
        console.log(err);
      })
  }

  getDateboolean(date){
    let strdate = '0000-00-00 00:00:00.000';
    if(date.toString() == strdate){
      return false;
    }else{
      return true;
    }
  }

  openMessagesMenu() {
    this.trigger.openMenu();
    this.selectedTab = 0;
  }

  onMouseLeave() {
    this.trigger.closeMenu();
  }

  stopClickPropagate(event: any) {
    event.stopPropagation();
    event.preventDefault();
  }

}
