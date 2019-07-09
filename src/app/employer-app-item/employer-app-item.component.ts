import { Component, OnInit, Input } from '@angular/core'
import { JobService } from  '../job.service'

@Component({
  selector: 'app-employer-app-item',
  templateUrl: './employer-app-item.component.html',
  styleUrls: ['./employer-app-item.component.css']
})
export class EmployerAppItemComponent implements OnInit {
  @Input() app: any
  status: string
  post_closed: boolean
  
  constructor(public jobService: JobService) { }

  ngOnInit() {
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
