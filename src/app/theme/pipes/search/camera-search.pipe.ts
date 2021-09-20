import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'CameraSearchPipe', pure: false })
export class CameraSearchPipe implements PipeTransform {
  transform(value, args?): Array<any> {
    let searchText = new RegExp(args, 'ig');
    if (value) {
      return value.filter(camera => {
        if (camera.camera_location) {
          return camera.camera_location.search(searchText) !== -1;
        }
        else{
          return camera.company_name.search(searchText) !== -1;
        }
      });
    }
  }
}
