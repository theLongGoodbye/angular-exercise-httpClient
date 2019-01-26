import { Component, OnInit } from '@angular/core';
import {Hero} from './hero';
import {HeroesService} from './heroes.service';
import {Observable} from 'rxjs';
const log = console.log.bind(console, '***heroesComponent')
@Component({
  selector: 'app-heros',
  templateUrl: './heros.component.html',
  providers: [HeroesService],
  styleUrls: ['./heros.component.scss']
})
export class HerosComponent implements OnInit {
  heroes: Hero[]
  editHero: Hero

  constructor(private heroesService: HeroesService) { }

  getHeroes() {
    this.heroesService.getHeroes()
      .subscribe(heroes => this.heroes = heroes)
  }

  add(name) {
    this.editHero = undefined
    name = name.trim()
    if (!name) {return}

    //注意这个写法
    const newHero: Hero = {name: name} as Hero
    log('新添加的英雄是什么样的', newHero)

    //后端 api 会根据传过去的对象生成一个 带 id 的 hero
    this.heroesService.addHeroes(newHero)
      .subscribe(hero => this.heroes.push(hero))
  }

    delete(hero: Hero) {
      // 用 filter 生成一个符合回调函数内条件的新数组（不需要删除的英雄留下）
      this.heroes = this.heroes.filter(h => h !== hero)
      //可以只订阅，不执行 next 函数（即使有返回数据）
      this.heroesService.deloteHero(hero.id).subscribe()
    }

    edit(hero) {
      // 对象浅复制（指向同一个内存地址）， 所以当 hero 变化的时候，this.editHero 的值会跟着变
      this.editHero = hero
    }

    update() {
    if (this.editHero) {
      this.heroesService.updateHero(this.editHero)
        .subscribe(hero => {
          const ix = hero ? this.heroes.findIndex(h => hero.id == h.id) : -1
          if (ix > -1) {this.heroes[ix] = hero}
        })
      this.editHero = undefined
    }
    }

    search(searchTerm: string) {
      this.editHero = undefined
      this.heroesService.searchHeroes(searchTerm)
        .subscribe(heroes => this.heroes =heroes)
    }

  ngOnInit() {
    //获取数据的问题在于不知道要多长时间，订阅的数据一旦拿到，this.heroes 就会被赋值
    //模板就会开始渲染，
    setTimeout(() => {
      this.getHeroes()
    }, 3000)

    // 在拿到数据之前，this.heroes 是 undefined， 模板既不会渲染，也不会报错
    // setInterval(() => {
    //   log(this.heroes)
    // }, 1000)
  }

}
