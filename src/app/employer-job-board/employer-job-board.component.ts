import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { Subscription } from 'rxjs'
import { ActivatedRoute, Router } from '@angular/router'
import { PageEvent } from '@angular/material/paginator'

//testing
import { CookieService } from 'ngx-cookie-service'

import { Job } from '../job'
import { JobService } from '../job.service'
import { OptionsService } from '../options.service'

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
  _querySub: Subscription
  sortValue: string
  sorts: any[]
  limit: number

  //testing
  id: number

  constructor(public jobService: JobService,
              private route: ActivatedRoute,
              private router: Router,
              public cookieService: CookieService,
              private optionsService: OptionsService
            ) { }

  ngOnInit() {
    this.limit = 5
    this.loading = true
    this.count = 0
    this.id = +this.cookieService.get('posted_by_id')
    // this.getJobCountEmployer()
    this.logged_in = false
    // this.count = NaN
    // this.getPageNumber()
    this.sorts = []
    this.optionsService.loadData().subscribe(
      res => this.sorts = res.data.sorts,
      err => console.error(err)
    )
    this.sortValue = "Sort: Latest to Oldest"
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
      this._querySub = this.route.queryParamMap.subscribe(
        (res:any) => {
          console.log("change")
          this.getJobsByPageEmployer(this.page, res.params.order, res.params.how)
        },
        err => console.error(err)
      )
    })
  }

  getJobsByPageEmployer(page:number, order?: string, how?:string) {
    // const start = 10 * (this.page - 1)
    this.jobService.getJobsPerPageEmployer(this.id,page,this.limit,order,how).subscribe(
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

  selected(event) {
    console.log(event.source.value)
    this.sortValue = event.source.value
    const options = this.sorts[event.source.value]
    this.router.navigate([`../employer/jobs/${this.page}`], {queryParams: {order:options.order, how:options.how}})
  }

  ngOnDestroy() {
    this._querySub.unsubscribe()
  }

}
