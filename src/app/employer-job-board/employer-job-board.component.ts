import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { Observable, of } from 'rxjs'
import { ActivatedRoute, Router } from '@angular/router'
import { PageEvent } from '@angular/material/paginator'

//testing
import { CookieService } from 'ngx-cookie-service'

import { Job } from '../job'
import { JobService } from '../job.service'

@Component({
  selector: 'app-employer-job-board',
  templateUrl: './employer-job-board.component.html',
  styleUrls: ['./employer-job-board.component.css']
})
export class EmployerJobBoardComponent implements OnInit {
  // @Output() job_ad: EventEmitter<Job> = new EventEmitter()
  logged_in: boolean
  loading: boolean
  jobs: Job[]
  count: number
  page: number
  routePage: number
  pageEvent = PageEvent

  //testing
  id: number

  constructor(public jobService: JobService,
              private route: ActivatedRoute,
              private router: Router,
              public cookieService: CookieService
            ) { }

  ngOnInit() {
    this.loading = true
    this.count = 0
    this.id = +this.cookieService.get('posted_by_id')
    // this.getJobCountEmployer()
    this.logged_in = false
    // this.count = NaN
    // this.getPageNumber()
    this.route.params.subscribe((res) => {
      this.page = res.page
      if(isNaN(this.page)) {
        this.router.navigate(['/../employer/jobs', 1])
        //navigate to error page
      }
      else if(!this.page || this.page === 0) {
        this.page = 1
      }
      this.getJobsByPageEmployer(this.page)
    })
  }

  // getAllJobs() {
  //   this.jobService.getAllJobs().subscribe(
  //     (res) => {
  //       console.log(res.data)
  //       this.jobs = res.data
  //     },
  //     (err) => {
  //       console.error(err)
  //     }
  //   )
  // }

  getJobsByPageEmployer(page:number) {
    // const start = 10 * (this.page - 1)
    this.jobService.getJobsPerPageEmployer(this.id,page).subscribe(
      (res) => {
        console.log(res.data)
        this.count = res.data.count
        this.jobs = res.data.jobs
        this.loading = false
      },
      (err) => {
        console.error(err)
      }
    )
  }

  loadPage(event?: PageEvent) {
    this.router.navigate([`../employer/jobs/`, event.pageIndex + 1])
  }

}
