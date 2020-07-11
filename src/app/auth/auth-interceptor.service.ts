import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthService } from './auth.service';

// @Injectable() required to inject services into another service
@Injectable()

export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  // HttpInterceptor forces the creation of the intercept method
  //    HttpRequest set to <any> because I want to intercept all HTTP requests, not just one
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.authService.getToken();

    // clone the request *before* modification or you will have unintended consequences!!!
    const authRequest = req.clone({
      // does *not* overwrite all headers, only the same one
      //    if this header is not already there, it will add it to the other headers
      headers: req.headers.set('Authorization', "Bearer " + authToken) // "Bearer" prepended is just a convention - not required
    });

    // the intercept method requires use to return the modified request
    return next.handle(authRequest);
  }
}
