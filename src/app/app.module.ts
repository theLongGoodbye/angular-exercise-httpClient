

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

import{HttpClientModule} from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';

import { ReactiveFormsModule } from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import { HerosComponent } from './heros/heros.component';
import {HttpErrorHandler} from './http-error-handler.service';
import {InMemoryDataService} from './in-memory-data.service';
import { MessagesComponent } from './messages/messages.component';
import { ConfigComponent } from './config/config.component';
import { DownloaderComponent } from './downloader/downloader.component';
import { UploaderComponent } from './uploader/uploader.component';
import { PackgeSearchComponent } from './packge-search/packge-search.component';




@NgModule({
  declarations: [
    AppComponent,
    HerosComponent,
    MessagesComponent,
    ConfigComponent,
    DownloaderComponent,
    UploaderComponent,
    PackgeSearchComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,

    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, {
        dataEncapsulation: false,
        passThruUnknownUrl: true,
        put204: false // return entity after PUT/update
      }
    )
  ],
  providers: [
  ],
  entryComponents: [ ],
  bootstrap: [AppComponent]
})
export class AppModule { }
