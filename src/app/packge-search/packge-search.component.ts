import { Component, OnInit } from '@angular/core';
import {NpmPackageInfo, PackgeServiceService} from './packge-service.service';
import {Observable, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
const log = console.log.bind(console, '**searchComponent')

@Component({
  selector: 'app-packge-search',
  templateUrl: './packge-search.component.html',
})
export class PackgeSearchComponent implements OnInit {
  withRefresh = false;
  packages$: Observable<NpmPackageInfo[]>;

  // 1. 定义一个 Subject
  private searchText$ = new Subject<string>();

  search(packageName: string) {
    // 2.只要有数据输入，就调用 next方法
    this.searchText$.next(packageName)
  }

  constructor(private searchService: PackgeServiceService) { }


  ngOnInit() {
    // 3.只要调用了 next 的方法，右边的函数或者 订阅函数就会执行
    this.packages$ = this.searchText$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(packageName =>
        this.searchService.search(packageName, this.withRefresh))
    )

    // this.searchText$.subscribe(
    //   data => log(data)
    // )

  }
  toggleRefresh() { this.withRefresh = ! this.withRefresh; }
}
