import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeliveryService } from '@app/delivery/services/delivery.service';
import { User } from '@app/_models/user';
import { Router } from '@angular/router';



@Injectable()
export class RolesInterceptor implements HttpInterceptor {
    authorizedRoles: string[] = ["ROLE_SUPER_ADMIN","ROLE_DELIVERER"];

    constructor(private deliveryService: DeliveryService, private router: Router) { }
 
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if user is logged in and request is to the api url
        this.deliveryService.getDeliverer().subscribe( deliverer => {
            const deliv: User = deliverer;
            if (deliverer.roles.length > 0) {
                let isAuthorized: boolean = false;
                this.authorizedRoles.forEach( role => {
                deliverer.roles.forEach(roleU => isAuthorized = (roleU == role) || isAuthorized);
                });
        
                if (!isAuthorized) {
                    console.log("Vous n'avez pas acces à cette page vous n'êtes pas un livreur.");
                    this.router.navigate(['home']);
                }
            }
        });
        
    return next.handle(request);
  }
  
}
