import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  onSignUp(form: NgForm) {
    // console.log(form.value);
    if (form.invalid) {
      // do nothing
    }
    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password);
    // this.authService.createUser(form.value.email, form.value.password).subscribe(null, error => {
    //   this.isLoading = false;
    // });
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
