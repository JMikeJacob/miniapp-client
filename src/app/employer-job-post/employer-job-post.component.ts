import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { Location } from '@angular/common'
//testing
import { CookieService } from 'ngx-cookie-service'
import { JobService } from '../job.service'
import { Job } from '../job'


@Component({
  selector: 'app-employer-job-post',
  templateUrl: './employer-job-post.component.html',
  styleUrls: ['./employer-job-post.component.css']
})
export class EmployerJobPostComponent implements OnInit {
  @Input() job: Job
  no_job: boolean
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
    this.skills = []
    this.fields = []
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
        for(let i = 0; i < this.job.tags.length; i++) {
          if(this.job.tags[i].tag_type === "skill") {
            this.skills.push(this.job.tags[i].tag)
          }
          else if(this.job.tags[i].tag_type === "field") {
            this.fields.push(this.job.tags[i].tag)
          }
        }
      },
      (err) => {
        console.error(err)
        // console.log("yo")
        this.no_job = true
      }
    )
  }

  toEdit() {
    this.router.navigate([`../employer/jobs/edit/${this.job.job_id}`])
  }

  toDelete() {
    this.jobService.deleteJobPost(this.job.job_id).subscribe(
      (res) => {
        this.router.navigate([`../employer/jobs/1`])
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
