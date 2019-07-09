import { Component, OnInit } from '@angular/core'
import { CookieService } from 'ngx-cookie-service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-employer-navbar',
  templateUrl: './employer-navbar.component.html',
  styleUrls: ['./employer-navbar.component.css']
})
export class EmployerNavbarComponent implements OnInit {

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
      this.cookieService.delete('posted_by_id', '/')
      this.cookieService.delete('company', '/')
      const cookie: {} = this.cookieService.getAll()
      console.log(cookie)
      this.router.navigate(['../index'])
    }
  }
}
