import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "./core/auth/auth-service";
import { map, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService,
        private router: Router) {

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this.authService.IsLogged.pipe(map(isAuth => {
            if (!isAuth) {
                this.router.navigate(['login'])
                return false;
            } else {
                return true;
            }
        }))
    }

}