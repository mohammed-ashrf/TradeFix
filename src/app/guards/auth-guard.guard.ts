import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const canActivateLoggedIn: CanActivateFn = (route, state) => {
const authService = inject(AuthService);
return authService.isLoggedIn();
};

export const canActivateHasAccess: CanActivateFn = (route, state) => {
  const user = inject(AuthService).getCurrentUser();
  if (!user) {
    return false;
  }

  const access = user.access;
  if (!access || !access.includes(route.url.join('/'))) {
    return false;
  }

  return true;
};
export const CanActivateRole: CanActivateFn = (route, state) => {
  const user = inject(AuthService).getCurrentUser();
  if (!user) {
    return false;
  }

  const role = user.role;
  if (!role || role !== route.url.join('/')) {
    return false;
  }

  return true;
}