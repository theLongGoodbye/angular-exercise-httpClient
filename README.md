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
