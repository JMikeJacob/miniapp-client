import { Component, OnInit, Input } from '@angular/core'
import { JobService } from  '../job.service'
import { NotificationService } from '../notification.service'
import { CookieService } from 'ngx-cookie-service'

@Component({
  selector: 'app-employer-app-item',
  templateUrl: './employer-app-item.component.html',
  styleUrls: ['./employer-app-item.component.css']
})
export class EmployerAppItemComponent implements OnInit {
  @Input() app: any
  status: string
  post_closed: boolean
  id: number
  constructor(public jobService: JobService,
              private notificationService: NotificationService,
              private cookieService: CookieService) { }

  ngOnInit() {
    this.id = +this.cookieService.get('posted_by_id')
    this.status = this.app.status
    console.log(this.app)
    if(this.app.is_open==="no" && this.app.status==="pending") {
      this.post_closed = true
    }
    else {
      this.post_closed = false
    }
  }

  accept() {
    this.jobService.changeApplicationStatus(this.app.user_id, this.app.job_id, "accepted").subscribe(
      (res) => {
        console.log(res)
        this.status = "accepted"
        this.notificationService.respondNotification({
          to: this.app.user_id,
          from: this.id,
          message: `You have been accepted for the ${this.app.job_name} position!`,
          type: "accept"
        })
      },
      (err) => {
        console.error(err)
      }
    )
  }

  reject() {
    this.jobService.changeApplicationStatus(this.app.user_id, this.app.job_id, "rejected").subscribe(
      (res) => {
        console.log(res)
        this.status = "rejected"
      },
      (err) => {
        console.error(err)
      }
    )
  }
}
