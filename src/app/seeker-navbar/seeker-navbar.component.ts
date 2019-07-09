import { Component, OnInit } from '@angular/core'
import { CookieService } from 'ngx-cookie-service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-seeker-navbar',
  templateUrl: './seeker-navbar.component.html',
  styleUrls: ['./seeker-navbar.component.css']
})
export class SeekerNavbarComponent implements OnInit {

  constructor(
    public cookieService: CookieService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  logout() {
    const cookies: {} = this.cookieService.getAll()
    console.log(cookies)
    if(cookies) {
      this.cookieService.delete('role', '/')
      this.cookieService.delete('user_id', '/')
      const cookie: {} = this.cookieService.getAll()
      console.log(cookie)
      this.router.navigate(['../index'])
    }
  }
}
