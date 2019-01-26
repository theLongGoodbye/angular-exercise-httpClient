import { Component, OnInit } from '@angular/core';
import { Config, ConfigService } from './config.service';
const log = console.log.bind(console, '**configComponent')
@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  providers: [ConfigService],
  styles: ['.error {color: red;}']
})
export class ConfigComponent implements OnInit {
  error: any
  headers: string[]
  config: Config
  constructor(private configService: ConfigService) { }

  clear() {
    this.config = undefined;
    this.error = undefined;
    this.headers = undefined;
  }

  showConfig() {
    log(666)
    this.configService.getConfig()
      .subscribe((data: Config) =>{
        return this.config = data},
        error => this.error = error
        )
  }

  //不传入 error 的 情况
  showConfig_v1() {
    this.configService.getConfig_1()
      .subscribe((data: Config) => this.config = {
        heroesUrl: data['heroesUrl'],
        textfile:  data['textfile']
      });
  }
  //和上面的 v1 没区别啊
  showConfig_v2() {
    this.configService.getConfig()
    // clone the data object, using its known Config shape
      .subscribe((data: Config) => this.config = { ...data });
  }

  showConfigResponse() {
    this.configService.getConfigResponse()
      .subscribe(resp => {
        log('resp', resp)
        log('headers', resp.headers)
        const keys = resp.headers.keys()
        log('keys', keys)
        this.headers = keys.map(key => `${key}: ${resp.headers.get(key)}`)
        this.config = resp.body
      })
  }

  makeError() {
    this.configService.makeIntentionalError()
      // 当你不想写 next 的时候，写 null
      .subscribe(null, error => this.error = error
        )
  }

  ngOnInit() {
  }

}
