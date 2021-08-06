import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ConfigService {
  constructor(private http: HttpClient) { }

  async load() {
    if (this.get('nodes').length === 0) {
      await this.http.get<any>('assets/files/data.json')
        .toPromise()
        .then(res =>
          localStorage.setItem('nodes', JSON.stringify(res.data)))
    }
  }
  get(key: string) {
    return (localStorage.getItem(key) ? JSON.parse(<string>localStorage.getItem(key)) : [])
  }
  save(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  }
}
