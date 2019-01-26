import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

import { interval } from 'rxjs';


const log = console.log.bind(console)

@Component({
  selector: 'app-root',
  template: `
    <h1>HTTP Sample</h1>
    <div>
      <!--把 [checked] 赋值为点击事件的函数-->
      <input type="checkbox" id="heroes" [checked]="toggleHeroes" (click)="toggleHeroes()">
      <label for="heroes">Heroes</label>

      <input type="checkbox" id="config" [checked]="showConfig" (click)="toggleConfig()">
      <label for="config">Config</label>

      <input type="checkbox" id="downloader" [checked]="showDownloader" (click)="toggleDownloader()">
      <label for="downloader">downloader</label>

      <input type="checkbox" id="uploader" [checked]="showUploader" (click)="toggleUploader()">
      <label for="uploader">uploader</label>

      <input type="checkbox" id="search" [checked]="showSearch" (click)="toggleSearch()">
      <label for="search">search</label>
    </div>

    <app-heros *ngIf="showHerors"></app-heros>
    <app-messages></app-messages>
    <app-config *ngIf="showConfig"></app-config>
    <app-downloader *ngIf="showDownloader"></app-downloader>
    <app-uploader *ngIf="showUploader"></app-uploader>
    <app-packge-search *ngIf="showSearch"></app-packge-search>
    `,
  providers: [],
})

export class AppComponent implements OnInit {

  showHerors = true
  showConfig = true
  showDownloader = true
  showUploader = true
  showSearch = true

  toggleHeroes() {this.showHerors = !this.showHerors}
  toggleConfig() { this.showConfig = !this.showConfig; }
  toggleDownloader() { this.showDownloader = !this.showDownloader; }
  toggleUploader() { this.showUploader = !this.showUploader; }
  toggleSearch() { this.showSearch = !this.showSearch; }


  constructor(


  ) {

  }

  ngOnInit() {

  }



}










