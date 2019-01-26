import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {catchError, retry} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';


export interface Config {
  heroesUrl: string;
  textfile: string;
}

@Injectable()
export class ConfigService {
  configUrl = 'assets/config.json';

  constructor(private http: HttpClient) { }

  getConfig() {
    return this.http.get<Config>(this.configUrl)
      // 在请求数据的过程中，如果出现问题，就会执行下面的函数
      .pipe(
        retry(3),
        catchError(this.handleError)
      )
  }

  getConfig_1() {
    return this.http.get(this.configUrl)
  }

  getConfig_2() {
    return this.http.get<Config>(this.configUrl)
  }

  getConfig_3() {
    return this.http.get<Config>(this.configUrl)
      .pipe(
        catchError(this.handleError)
      )
  }

  getConfigResponse(): Observable<HttpResponse<Config>> {
    return this.http.get<Config>(
      this.configUrl, {observe: 'response'}
    )
  }


  // 捕获错误的函数直接复制了
  // subscribe 的第二个 error 函数里的参数，来自下方 throwError 里传的参数
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };

  makeIntentionalError() {
    return this.http.get('not/a/real/url')
      .pipe(
        catchError(this.handleError)
      );
  }

}
