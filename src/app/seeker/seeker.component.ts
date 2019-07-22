import { Component, OnInit } from '@angular/core'
import { CookieService } from 'ngx-cookie-service'
import { Router } from '@angular/router'
import { NotificationService } from '../notification.service'
import { Subscription } from 'rxjs'
import { Notification } from '../notification'

@Component({
  selector: 'app-seeker',
  templateUrl: './seeker.component.html',
  styleUrls: ['./seeker.component.css']
})
export class SeekerComponent implements OnInit {

  __notifSub: Subscription
  _removerSub: Subscription
  accepts: Notification[]

  constructor(
    public cookieService: CookieService,
    public router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.accepts = []
    const cookies = {} = this.cookieService.getAll()
    console.log(cookies)
    const role = this.cookieService.get('role')
    if(!role) {
      this.router.navigate([`../index`])
    }
    else if(role==="employer") {
      this.router.navigate([`../employer`])
    }
    else {
      this.notificationService.subscribeToNotifs('seeker', +this.cookieService.get('user_id'))
      this.__notifSub = this.notificationService.notification.subscribe(
        (notif) => {
          if(notif.type = "accept") {
            this.accepts.push(notif)
          }
        }
      )
      this._removerSub = this.notificationService.editNotification$.subscribe(
        (res) => {
          this.accepts = []
        }
      )
    }
  }

  followLink() {
    this.notificationService.editNotification("remove")
    this.accepts = []
    this.router.navigate(["/seeker/apps/1"])
  }

  removeNotifs() {
    this.notificationService.editNotification("remove")
    this.accepts = []
  }

  ngOnDestroy() {
    if(this.__notifSub) {
      this.__notifSub.unsubscribe()
    }
    if(this._removerSub) {
      this._removerSub.unsubscribe()
    }
  }

}
