import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'CompanySearchPipe', pure: false })
export class CompanySearchPipe implements PipeTransform {
  transform(value, args?): Array<any> {
    let searchText = new RegExp(args, 'ig');
    // let searchTextCompany=new RegExp(args, 'ig');
    if (value) {
      return value.filter(company => {
        if (company.company_location) {
          return company.company_location.search(searchText) !== -1 || company.company_name.search(searchText) !== -1;
        }
        else{
          // return company.company_location.search(searchText) !== -1;
          return company.company_name.search(searchText) !== -1;
        }
      });
    }
  }
}