import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { demoStateInterceptor } from './demo-state.interceptor';
import { DemoStateService } from './demo-state.service';

describe('demoStateInterceptor', () => {
  let http: HttpClient;
  let ctrl: HttpTestingController;
  let demo: DemoStateService;
  const api = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([demoStateInterceptor])), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpClient);
    ctrl = TestBed.inject(HttpTestingController);
    demo = TestBed.inject(DemoStateService);
  });

  afterEach(() => {
    demo.set('normal');
    ctrl.verify();
  });

  it('en «normal» no añade la cabecera', () => {
    demo.set('normal');
    http.get(`${api}/entries/today`).subscribe();
    expect(ctrl.expectOne(`${api}/entries/today`).request.headers.has('X-Demo-State')).toBe(false);
  });

  it('en «empty» la añade a las lecturas', () => {
    demo.set('empty');
    http.get(`${api}/entries/today`).subscribe();
    expect(ctrl.expectOne(`${api}/entries/today`).request.headers.get('X-Demo-State')).toBe('empty');
  });

  it('nunca en escrituras, /config ni /auth', () => {
    demo.set('error');
    http.post(`${api}/entries`, {}).subscribe();
    http.get(`${api}/config`).subscribe();
    http.get(`${api}/auth/me`).subscribe();
    expect(ctrl.expectOne(`${api}/entries`).request.headers.has('X-Demo-State')).toBe(false);
    expect(ctrl.expectOne(`${api}/config`).request.headers.has('X-Demo-State')).toBe(false);
    expect(ctrl.expectOne(`${api}/auth/me`).request.headers.has('X-Demo-State')).toBe(false);
  });
});
