import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { AuthService } from "./core/auth/auth-service";
import { map, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService,
        private router: Router) {

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
        return this.authService.IsLogged.pipe(map(isAuth => {
            return isAuth
                ? true
                : this.router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
        }))
    }

}
