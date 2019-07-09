import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { Location } from '@angular/common'
//testing
import { CookieService } from 'ngx-cookie-service'
import { JobService } from '../job.service'
import { Job } from '../job'

@Component({
  selector: 'app-seeker-job-post',
  templateUrl: './seeker-job-post.component.html',
  styleUrls: ['./seeker-job-post.component.css']
})
export class SeekerJobPostComponent implements OnInit {
  @Input() job: Job
  no_job: boolean
  applied: string
  user_id: number
  job_id: number
  constructor(
    private jobService: JobService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private cookieService: CookieService //testing
  ) { }

  ngOnInit() {
    this.applied = "no"
    this.no_job = true
    this.getJobPost()
  }

  getJobPost() {
    const id = +this.route.snapshot.paramMap.get('id')
    this.jobService.getJobPost(id).subscribe(
      (res) => {
        console.log(res)
        this.no_job = false
        this.job = res.data
        this.job_id = res.data.job_id
        this.user_id = +this.cookieService.get('user_id')
        this.checkIfApplied()
      },
      (err) => {
        console.error(err)
        // console.log("yo")
        this.no_job = true
      }
    )
  }

  checkIfApplied() {
    this.jobService.checkIfApplied({job_id: this.job_id, user_id: this.user_id}).subscribe(
      (res) => {
        console.log(res)
        this.applied = res.applied
      },
      (err) => {
        console.error(err)
      }
    )
  }

  apply() {
    const post = new Date().getTime()
    this.jobService.applyForJob({job_id: this.job_id, 
                                 user_id: this.user_id, 
                                 posted_by_id: this.job.posted_by_id,
                                 date_posted: post
    }).subscribe(
      (res) => {
        console.log(res)
        this.applied = "yes"
      },
      (err) => {
        console.log(err)
      }
    )
  }

  goBack() {
    this.location.back()
  }
}
