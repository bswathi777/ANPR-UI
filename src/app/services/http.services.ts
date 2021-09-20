import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import _ from 'lodash';
import { map, tap, catchError } from "rxjs/operators";
import { Observable } from "rxjs";
import { GlobalServices } from "./global.service";

@Injectable()
export class HttpServices {
  formData: FormData;
  constructor(private http: HttpClient, private GlobalServices: GlobalServices) { }

  public httpLogin(url, header) {
    return this.http.post(url, "", {
      headers: header
    })
      .pipe(map((res) => res),
        catchError((err) => {
          return new Observable(observer => {
            observer.error(err);
          });
        }));
  }

  public HttpRequest(request: {
    url: string,
    method: string,
    data?: any,
    headers?: {},
    params?: {},
    file?: any,
    apiToken?: any,
    fileInputName?: string
  }) {

    let params: HttpParams = new HttpParams();
    let headers: HttpHeaders = new HttpHeaders();
    if (request.params) {
      _.forEach(request.params, (val, key) => {
        params = params.set(key.toString(), val);
      });
    }

    if (request.headers) {
      _.forEach(request.headers, (val, key) => {
        headers = headers.set(key.toString(), val);
      });
    }

    let authHeaders;

    if (request.apiToken) {
      authHeaders = {
        'Authorization': 'Token ' + request.apiToken,
        'Client-Type': 'WEB',
        'App-Id': 'ANPR'
      };
      _.forEach(authHeaders, (val, key) => {
        headers = headers.set(key.toString(), val);
      });
    } else {
      authHeaders = this.GlobalServices.getAuthorization();
      _.forEach(authHeaders, (val, key) => {
        headers = headers.set(key.toString(), val);
      });
    }


    let service: any;
    const options: any = { headers, params };
    if (request.method === 'P') {
      service = this.http.post(request.url, request.data, options);
    }
    if (request.method === 'PU') {
      service = this.http.put(request.url, request.data, options);
    }
    if (request.method === 'G') {
      service = this.http.get(request.url, options);
    }
    if (request.method === 'D') {
      service = this.http.delete(request.url, { body: request.data, ...options });
    }
    if (request.method == 'F') {
      const formData: FormData = new FormData();
      formData.append('file', request.file, request.file.name);
      headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json');
      this.formData = formData;
    }
    if (request.method === 'DW') {
      service = this.http.get(request.url, { ...options, responseType: 'arraybuffer', observe: 'response' });
    }
    if (request.method == 'DW') {
      let newTab = false;
      return this.http.get(request.url, ...options).pipe(tap((res) => {
        let newBlob = new Blob([res['file_name']], { type: 'application/json' });

        // IE doesn't allow using a blob object directly as link href
        // instead it is necessary to use msSaveOrOpenBlob
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(newBlob);
          return;
        }

        // For other browsers: 
        // Create a link pointing to the ObjectURL containing the blob.
        const data = window.URL.createObjectURL(newBlob);

        var link = document.createElement('a');
        link.href = data;
        if (newTab) {
          link.target = '_blank';
        }

        link.download = "report";
        // this is necessary as link.click() does not work on the latest firefox
        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

        setTimeout(function () {
          // For Firefox it is necessary to delay revoking the ObjectURL
          window.URL.revokeObjectURL(data);
        }, 100);
      }))
    }
    return service.pipe(
      tap((res) => {
        
        if (res && res['success'] == 2) {
          this.GlobalServices.invalidApiToken();
        } else {
          return res;
        }
      }),
      catchError((err) => {
        if (err && err['success'] == 2) {
          this.GlobalServices.invalidApiToken();
        }
        return new Observable(observer => {
          observer.error(err);
        });
      }));
  }
}