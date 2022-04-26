import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import * as signalR from '@microsoft/signalr';          // import signalR
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { NgForm } from '@angular/forms';




@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public profileJson: string = "";
  constructor(public auth: AuthService, private http: HttpClient ) {
  }
  onSubmit(contactForm: NgForm) {
    if (contactForm.valid) {
      const email = contactForm.value;
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      this.http.post('https://formspree.io/f/xlezoryy',
        { subject: email.subject, replyto: email.email, message: email.messages },
        { 'headers': headers }).subscribe(
          response => {
            console.log(response);
          }
        );
    }
  }

  ngOnInit(): void {
    this.auth.user$
    .subscribe((profile) => {
      this.profileJson = JSON.stringify(profile, null, 2)
    });
  }


}
