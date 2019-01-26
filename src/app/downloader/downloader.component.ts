import { Component, OnInit } from '@angular/core';
import {DownloaderService} from './downloader.service';

@Component({
  selector: 'app-downloader',
  templateUrl: './downloader.component.html',
})
export class DownloaderComponent implements OnInit {
  contents: string
  constructor(private downService: DownloaderService) { }

  clear() {
    this.contents = undefined
  }

  download() {
    this.downService.getTextFile('assets/textfile.txt')
      .subscribe(results => this.contents = results)
  }

  ngOnInit() {
  }

}
