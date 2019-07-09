import { Component, OnInit } from '@angular/core'
import { CookieService } from 'ngx-cookie-service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-seeker',
  templateUrl: './seeker.component.html',
  styleUrls: ['./seeker.component.css']
})
export class SeekerComponent implements OnInit {

  constructor(
    public cookieService: CookieService,
    private router: Router
  ) { }

  ngOnInit() {
    if(!this.cookieService.get('role')) {
      this.router.navigate([`../index`])
    }
  }

}
