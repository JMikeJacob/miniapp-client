import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { Observable } from 'rxjs'
import { ActivatedRoute, Router } from '@angular/router'
import { PageEvent } from '@angular/material/paginator'

import { Job } from '../job'
import { JobService } from '../job.service'
// import { EventEmitter } from 'events';

@Component({
  selector: 'app-job-board',
  templateUrl: './job-board.component.html',
  styleUrls: ['./job-board.component.css']
})
export class JobBoardComponent implements OnInit {
  // @Input() job:Job
  // @Output() job_ad: EventEmitter<Job> = new EventEmitter()
  logged_in: boolean
  loading: boolean
  jobs: Job[]
  count: Observable<any>
  page: number
  routePage: number
  pageEvent = PageEvent

  constructor(public jobService: JobService,
              private route: ActivatedRoute,
              private router: Router
            ) { }

  ngOnInit() {
    this.loading = true
    this.jobs = []
    this.logged_in = false
    // this.count = NaN
    // this.getPageNumber()
    this.route.params.subscribe((res) => {
      this.page = res.page
      console.log(this.page)
      if(isNaN(this.page)) {
        this.router.navigate(['/../jobs', 1])
        //navigate to error page
      }
      else if(!this.page || this.page === 0) {
        this.page = 1
      }
      this.getJobsByPage(this.page)
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

  getJobsByPage(page:number) {
    // const start = 10 * (this.page - 1)
    this.jobService.getJobsPerPage(page).subscribe(
      (res) => {
        console.log(res.data)
        this.count = res.data.count
        if(res.data.jobs) {
          this.jobs = res.data.jobs
        }
        this.loading = false
      },
      (err) => {
        console.error(err)
      }
    )
  }

  loadPage(event?: PageEvent) {
    this.router.navigate([`../jobs/`, event.pageIndex + 1])
  }

}
