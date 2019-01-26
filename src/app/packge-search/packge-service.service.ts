import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {HandleError, HttpErrorHandler} from '../http-error-handler.service';
import {Observable, of} from 'rxjs';
import {catchError, filter, map} from 'rxjs/operators';
const log = console.log.bind(console, '**packageService')


export interface NpmPackageInfo {
  name: string
  version: string
  description: string
}

export const searchUrl = 'https://npmsearch.com/query';

const httpOption = {
  headers: new HttpHeaders({
    'x-refresh': 'true'
  })
}

// 这里不懂，直接复制了
function createHttpOptions(packageName: string, refresh = false) {
  // npm package name search api
  // e.g., http://npmsearch.com/query?q=dom'
  const params = new HttpParams({ fromObject: { q: packageName } });
  const headerMap = refresh ? {'x-refresh': 'true'} : {};
  const headers = new HttpHeaders(headerMap) ;
  return { headers, params };
}



@Injectable({
  providedIn: 'root'
})
export class PackgeServiceService {
  private handleError: HandleError

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler)
   {this.handleError = httpErrorHandler.createHandleError('HeroesService'); }

   search(packageName: string, refresh = false): Observable<NpmPackageInfo[]> {
    //  如果没有输入内容的话，返回一个空数组
    if (!packageName.trim()) { return of([]); }

     const options = createHttpOptions(packageName, refresh);

     return this.http.get(searchUrl, options).pipe(
       map((data: any) => {
         log('data', data)
         //data.results 应该是个数组
         log('data.results', data.results)
         return data.results.map(entry => ({
           name: entry.name[0],
           version: entry.version[0],
           description: entry.description[0]
         }))
       }),
       catchError(this.handleError('search', []))
     )
   }


}
