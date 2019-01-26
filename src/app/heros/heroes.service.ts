import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {HandleError, HttpErrorHandler} from '../http-error-handler.service';
import {Observable} from 'rxjs';
import {Hero} from './hero';
import {catchError} from 'rxjs/operators';
const log = console.log.bind(console, '***heroesService')
//这个文件负责增删改查的具体逻辑和实现
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
}

@Injectable()
export class HeroesService {
  heroUrl = 'api/heroes' // URL to web api
  private handleError: HandleError

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler
  ) {
    //下面这一句会得到这个函数，(operation = 'operation', result = {} as T) => this.handleError(serviceName, operation, result);
    this.handleError = httpErrorHandler.createHandleError('HeroService')
  //  相当于 this.handleError = (operation = 'operation', result = {} as T) => this.handleError(serviceName, operation, result);
  }

// 从后端获取 英雄数据

  getHeroes(): Observable<Hero[]> {
    //  Observable<Hero[]> ,尖括号里的类型表示 返回的 Observable 装载的数据的类型
    return this.http.get<Hero[]>(this.heroUrl)
  //  this.http.get<Hero[]>,尖括号里的类型表示发出请求后，返回的数据的类型
      .pipe(
        //this.handleError('getHeroes', []) 执行后，又得到了一个函数
        //下面这句相当于 catchError((error: HttpErrorResponse): Observable<T> => {
        //
        //       console.error(error); // log to console instead
        //
        //       const message = (error.error instanceof ErrorEvent) ?
        //         error.error.message :
        //         `server returned code ${error.status} with body "${error.error}"`;
        //
        //
        //       this.messageService.add(`${serviceName}: ${operation} failed: ${message}`);
        //
        //       // Let the app keep running by returning a safe result.
        //       return of( result );
        //     };)
        catchError(this.handleError('getHeroes', []))
      )
  }

  //查
  searchHeroes(term): Observable<Hero[]> {
    term = term.trim()
    const options = term ? {params: new HttpParams().set('name', term)} : {}
    log('options', options)
    log('new HttpParams().set(\'name\', term)', new HttpParams().set('name', term))
    return this.http.get<Hero[]>(this.heroUrl, options).pipe(
      catchError(this.handleError('searchHeroes', []))
    )
  }

  //增
  addHeroes(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroUrl, hero, httpOptions)
      .pipe(
        catchError(this.handleError('addHeroes', hero))
      )
  }

  //刪
  deloteHero(id: number): Observable<{}> {
    const url = `${this.heroUrl}/${id}`
    return this.http.delete(url, httpOptions)
      .pipe(
        catchError(this.handleError('deleteHero'))
      )
  }

//改
  updateHero(hero: Hero): Observable<Hero> {
    httpOptions.headers = httpOptions.headers.set('Authorization', 'my-new-auth-token')

    return this.http.put<Hero>(this.heroUrl, hero, httpOptions)
      .pipe(
        catchError(this.handleError('updateHero', hero))
      )
  }

}
