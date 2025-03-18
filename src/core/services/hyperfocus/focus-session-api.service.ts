import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FocusSession } from 'src/core/models/focus-session.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FocusSessionApiService {

  private http = inject(HttpClient);
  private apiUrl = environment.apiURL + 'sessions';

  constructor() { }

  startOrResumeSession(focusSession: FocusSession): Observable<FocusSession> {
    return this.http.put<FocusSession>(this.apiUrl + '/status/start', focusSession);
  }
}
