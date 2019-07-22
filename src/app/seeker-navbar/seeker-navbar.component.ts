import { Component, OnInit } from '@angular/core'
import { CookieService } from 'ngx-cookie-service'
import { Router } from '@angular/router'
import { NotificationService } from '../notification.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-seeker-navbar',
  templateUrl: './seeker-navbar.component.html',
  styleUrls: ['./seeker-navbar.component.css']
})
export class SeekerNavbarComponent implements OnInit {
  notifCount: number
  _notifSub: Subscription
  _removerSub: Subscription
  name: string
  constructor(
    public cookieService: CookieService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.name = this.cookieService.get('name')
    this.notifCount = 0
    this._notifSub = this.notificationService.notification.subscribe(
      notif => this.notifCount++
    )
    this._removerSub = this.notificationService.editNotification$.subscribe(
      res => this.notifCount = 0
    )
  }

  logout() {
    const cookies: {} = this.cookieService.getAll()
    console.log(cookies)
    if(cookies) {
      this.notificationService.unsubscribeFromNotifs('seeker', +this.cookieService.get('user_id'))
      this.cookieService.delete('role', '/')
      this.cookieService.delete('user_id', '/')
      this.cookieService.delete('name', '/')
      const cookie: {} = this.cookieService.getAll()
      console.log(cookie)
      this.router.navigate(['../index'])
    }
  }

  removeNotifs() {
    this.notifCount = 0
    this.notificationService.editNotification("remove")
    if(this.router.url.split('/')[2] === "apps") {
      this.notificationService.editNotification("refresh")
    }
  }

  ngOnDestroy() {
    if(this._notifSub) {
      this._notifSub.unsubscribe()
    }
    if(this._removerSub) {
      this._removerSub.unsubscribe()
    }
  }
}
