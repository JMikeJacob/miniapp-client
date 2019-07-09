import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-employer',
  templateUrl: './employer.component.html',
  styleUrls: ['./employer.component.css']
})
export class EmployerComponent implements OnInit {

  constructor(
    private router: Router,
    public cookieService: CookieService
  ) { }

  ngOnInit() {
    if(!this.cookieService.get('role')) {
      this.router.navigate([`../index`])
    }
  }

}
