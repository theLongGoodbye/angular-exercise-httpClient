import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MessageService} from '../message.service';
import {tap} from 'rxjs/operators';
const log = console.log.bind(console, '**downloader')

@Injectable({
  providedIn: 'root'
})
export class DownloaderService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  getTextFile(filename: string) {
    return this.http.get(filename, {responseType: 'text'})
      .pipe(
        tap(
          data => log('service-data',data),
          error => log('service-error', error)
        )
      )
  }

}
