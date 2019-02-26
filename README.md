# angular-exercise-httpClient
跟着官网的代码做练习

效果如下：<br>
 https://thelonggoodbye.github.io/angular-exercise-httpClient/

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
getTextFile(filename: string) {
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

#### 上传文件的做法（uploader 文件夹）
//定义上传函数

```
upload(file: File) {
    if (!file) {return}
    // COULD HAVE WRITTEN:
    // return this.http.post('/upload/file', file, {
    //   reportProgress: true,
    //   observe: 'events'
    // }).pipe(

    //这段英文注解很重要
    // Create the request object that POSTs the file to an upload endpoint.
    // The `reportProgress` option tells HttpClient to listen and return
    // XHR progress events.
    const req = new HttpRequest('POST', 'assets/upload', file, {
      reportProgress: true
    })

    // The `HttpClient.request` API produces a raw event stream
    // which includes start (sent), progress, and response events.
    return this.http.request(req)
      .pipe(
        map(event => this.getEventMessage(event, file)),
        tap(message => log('message', message)),
        last(),
        catchError(this.handleError(file))
      )
  }
```

//The `HttpClient.request` API produces a raw event stream <br/>
//根据返回的不同的 event 类型，返回对应的响应内容
```
private getEventMessage(event: HttpEvent, file) {
    log('执行')
    switch (event.type) {
      case HttpEventType.Sent:
        return `Uploading file '${file.name}' of size ${file.size}`

      case HttpEventType.UploadProgress:
        // Compute and show the % done:
        const percentDone = Math.round(100 * event.loaded / event.total)
        return `File "${file.name}" is ${percentDone}% uploaded`

      case HttpEventType.Response:
        return `File "${file.name}" was completely uploaded!`;

      default:
        return `File "${file.name}" surprising upload event: ${event.type}.`;
    }
  }
```
#### 错误捕获函数的两种写法
//注意这里用的 handleError 和上面有几点不一样 <br/>
//1.放进 catchError 的时候带了参数 <br/>
//2.handleError 在定义的时候接收的参数不一样 <br/>
//3.调用的时候一个要传参，一个不要 <br/>
//4.一个返回的是 throwError（error），一个返回的是 of(data)，data 是 next 回调函数里面接收的数据 <br/>
//5. 可以直接采用第一种，把 throwError 换成 of <br/>
**//6.对比发现，catchError 里面接收的一定是一个 (error: HttpErrorResponse) {} 形式的函数，其实两种写法都保证了这一点 ** 
```
private handleError(file: File) {
    const userMessage = `${file.name} upload failed.`;

    return (error: HttpErrorResponse) => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      const message = (error.error instanceof Error) ?
        error.error.message :
        `server returned code ${error.status} with body "${error.error}"`;

      // Let app keep running but indicate failure.
      return of(userMessage);
    };
  }
```

#### 根据输入框返回搜索响应内容以及 Subject 对象的使用套路 - packge-search 文件夹
