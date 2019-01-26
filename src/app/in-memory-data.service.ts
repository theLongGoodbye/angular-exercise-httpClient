import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';

//这个文件不能有 @Injectable 装饰器
export class InMemoryDataService implements InMemoryDbService {

  createDb() {
    const heroes = [
      { id: 11, name: 'Mr. Nice' },
      { id: 12, name: 'Narco' },
      { id: 13, name: 'Bombasto' },
      { id: 14, name: 'Celeritas' },
    ];
    return {heroes};
  }
}
