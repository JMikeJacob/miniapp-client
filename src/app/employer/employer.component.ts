import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { NotificationService } from '../notification.service'
import { Notification } from '../notification'

@Component({
  selector: 'app-employer',
  templateUrl: './employer.component.html',
  styleUrls: ['./employer.component.css']
})
export class EmployerComponent implements OnInit {
  notifs: Notification[]
  _notifSub: Subscription
  _removerSub: Subscription

  constructor(
    public router: Router,
    public cookieService: CookieService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.notifs = []
    const role = this.cookieService.get('role')
    if(!role) {
      this.router.navigate([`../index`])
    }
    else if(role==="seeker") {
      this.router.navigate([`/seeker`])
    }
    else {
      this.notificationService.subscribeToNotifs('employer', +this.cookieService.get('posted_by_id'))
      this._notifSub = this.notificationService.notification.subscribe(notif => {
        this.notifs.push(notif)
        this.notificationService.sendNotifications(this.notifs)
      })
      this._removerSub = this.notificationService.editNotification$.subscribe(
        (res) => this.notifs = []
      )
    }
  }

  followLink() {
    this.notifs = []
    this.notificationService.editNotification("remove")
    this.router.navigate(["employer/apps/1"])
  }

  removeNotifs() {
    this.notifs = []
    this.notificationService.editNotification("remove not navbar")
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
