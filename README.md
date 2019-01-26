# angular-exercise-httpClient
跟着官网的代码做练习

#### 定义接口
```
export interface Config {
  heroesUrl: string;
  textfile: string;
}
```


#### 异步获取数据的两个步骤


```
// 1.请求数据
getHeroes(): Observable<Hero[]> {
    //  Observable<Hero[]> ,尖括号里的类型表示 返回的 Observable 装载的数据的类型
    return this.http.get<Hero[]>(this.heroUrl)
  //  this.http.get<Hero[]>,尖括号里的类型表示发出请求后，返回的数据的类型
  }
```

```
// 2. 接收数据，只有当订阅之后，this.heroesService.getHeroes() 这个函数才会执行，然后在 next 回调函数里面接收数据 
getHeroes() {
    this.heroesService.getHeroes()
      .subscribe(next: heroes => this.heroes = heroes)
  }
```


#### 点击编辑的套路

```
//heroes文件夹中
    <a (click)="edit(hero)">
      <span class="badge">{{hero.id || -1}}</span>
      <span *ngIf="hero!==edtiHero">{{hero.name}}</span>
      <input *ngIf="hero === editHero" [(ngModel)]="hero.name"
      (blur)="update()" (keyup.enter)="update()">
    </a>
```

#### 捕获错误的套路（subcribe 的第二个参数 error， 完整代码在文件夹 config 里面）

//首先在服务文件中定义 handleError
```
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
    //下面这个函数里的参数就是 subcribe 里面的 error
    return throwError(
      'Something bad happened; please try again later.');
  };
```

//然后把这个函数放进调用函数的 pipe 管道里的 catchError 函数

```
getConfig() {
    return this.http.get<Config>(this.configUrl)
      // 在请求数据的过程中，如果出现问题，就会执行下面的函数
      // 注意 retry 函数，遇到错误会自己重新再发送 3 次请求
      .pipe(
        retry(3),
        catchError(this.handleError)
      )
  }
```
// 可以不自己定义 handleError 以及不使用 catchError，直接 log subcribe 里的 error，也可以看到错误信息


#### 读取文件内容

```
`getTextFile(filename: string) {
    return this.http.get(filename, {responseType: 'text'})
      .pipe(
        tap(
          data => log('service-data',data),
          error => log('service-error', error)
        )
      )
  }
  
  
  download() {
    this.downService.getTextFile('assets/textfile.txt')
      .subscribe(results => this.contents = results)
  }
```
