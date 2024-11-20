import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  private configUrl = '/api/GetConfig'; // Endpoint Azure Function per ottenere la configurazione

  constructor(private http: HttpClient) {}

  loadConfig(): Observable<any> {
    return this.http.get(this.configUrl);
  }
}
