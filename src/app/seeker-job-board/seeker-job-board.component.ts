import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { Observable } from 'rxjs'
import { ActivatedRoute, Router } from '@angular/router'
import { PageEvent } from '@angular/material/paginator'

import { Job } from '../job'
import { JobService } from '../job.service'

@Component({
  selector: 'app-seeker-job-board',
  templateUrl: './seeker-job-board.component.html',
  styleUrls: ['./seeker-job-board.component.css']
})
export class SeekerJobBoardComponent implements OnInit {
  jobs: Job[]
  loading: boolean
  count: Observable<any>
  page: number
  routePage: number
  pageEvent = PageEvent

  constructor(public jobService: JobService,
              private route: ActivatedRoute,
              private router: Router
            ) { }

  ngOnInit() {
    // this.count = NaN
    // this.getPageNumber()
    this.jobs = []
    this.loading = true
    this.route.params.subscribe((res) => {
      this.page = res.page
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
    this.router.navigate([`../seeker/jobs/`, event.pageIndex + 1])
  }

}
