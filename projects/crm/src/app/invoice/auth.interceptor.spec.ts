import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  createHttpFactory,
  HttpMethod,
  SpectatorHttp,
} from '@ngneat/spectator';
import { of } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { AuthInterceptor } from './auth.interceptor';

const API_URL = environment.apiUrl;

describe('AuthInterceptor', () => {
  let spectator: SpectatorHttp<AuthInterceptor>;

  const createSpectator = createHttpFactory({
    service: AuthInterceptor,
    mocks: [AuthService],
    providers: [
      { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    ],
  });

  beforeEach(() => {
    spectator = createSpectator();
  });

  it('should not act if the request URL does not begin with /invoice', () => {
    spectator
      .inject(HttpClient)
      .get(API_URL + '/users')
      .subscribe();

    const req = spectator.expectOne(API_URL + '/users', HttpMethod.GET);

    expect(req.request.headers.get('Authorization')).toBeNull();
  });

  it('should add the token if we call /invoice', () => {
    spyOnProperty(spectator.inject(AuthService), 'authToken$').and.returnValue(
      of('MOCK_TOKEN')
    );

    spectator
      .inject(HttpClient)
      .get(API_URL + '/invoice')
      .subscribe();

    const req = spectator.expectOne(API_URL + '/invoice', HttpMethod.GET);

    expect(req.request.headers.get('Authorization')).toBe('Bearer MOCK_TOKEN');
  });

  it('should throw an error if we call /invoice without a token', (done: DoneFn) => {
    spyOnProperty(spectator.inject(AuthService), 'authToken$').and.returnValue(
      of(null)
    );

    spectator
      .inject(HttpClient)
      .get(API_URL + '/invoice')
      .subscribe({
        error: (error) => {
          expect(error.message).toBe("Vous n'êtes pas authentifié !");
          done();
        },
      });
  });
});
