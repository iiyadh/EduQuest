import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export const authAdminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const token = localStorage.getItem('token');

  if (token) {
    return authService.isLoggedIn(token).pipe(
      map((res: any) => res.isLoggedIn),
      catchError((err: any) => {
        console.error(err);
        window.location.href = '/login';
        return [false];
      })
    ) as Observable<boolean>;
  }

  window.location.href = '/login';
  return false;
};
