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
  app_id: number
  user_id: number
  job_id: number
  skills: string[]
  fields: string[]
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
    this.skills = []
    this.fields = []
    this.getJobPost()
  }

  getJobPost() {
    const id = +this.route.snapshot.paramMap.get('id')
    this.jobService.getJobPost(id).subscribe(
      (res) => {
        console.log(res)
        this.no_job = false
        this.job = res.data
        for(let i = 0; i < this.job.tags.length; i++) {
          if(this.job.tags[i].tag_type === "skill") {
            this.skills.push(this.job.tags[i].tag)
          }
          else if(this.job.tags[i].tag_type === "field") {
            this.fields.push(this.job.tags[i].tag)
          }
        }
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
        this.app_id = res.app_id
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
        this.app_id = res.app_id
        this.applied = "yes"
      },
      (err) => {
        console.log(err)
      }
    )
  }

  withdraw() {
    this.jobService.deleteApplication(this.app_id).subscribe(
      (res) => {
        alert("Application withdrawn!")
        this.applied = "no"
      },
      (err) => {
        console.error(err)
      }
    )
  }

  goBack() {
    this.location.back()
  }
}
