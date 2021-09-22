import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-face-recognition',
  templateUrl: './face-recognition.component.html',
  styleUrls: ['./face-recognition.component.scss']
})
export class FaceRecognitionComponent implements OnInit {
  public showInfoContent: boolean = false;
  backToTop: any;
  constructor() { }

  ngOnInit() {
    
  }
  view(){
    console.log("gvfs")
  }
  @HostListener('window:resize')
 
  public onPsScrollY(event) {
    (event.target.scrollTop > 300) ? this.backToTop.nativeElement.style.display = 'flex' : this.backToTop.nativeElement.style.display = 'none';
  }



  
}
