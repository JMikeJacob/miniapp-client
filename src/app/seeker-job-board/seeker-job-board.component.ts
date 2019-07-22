import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { Observable, Subscription } from 'rxjs'
import { ActivatedRoute, Router } from '@angular/router'
import { PageEvent } from '@angular/material/paginator'

import { Job } from '../job'
import { JobService } from '../job.service'
import { OptionsService } from '../options.service'

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
  _querySub: Subscription
  sortValue: string
  sorts: any[]

  constructor(public jobService: JobService,
              private route: ActivatedRoute,
              private router: Router,
              private optionsService: OptionsService
            ) { }

  ngOnInit() {
    // this.count = NaN
    // this.getPageNumber()
    this.sorts = []
    this.optionsService.loadData().subscribe(
      res => this.sorts = res.data.sorts,
      err => console.error(err)
    )
    this.sortValue = "Sort: Latest to Oldest"
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
    this._querySub = this.route.queryParamMap.subscribe(
      (res:any) => {
        this.getJobsByPage(this.page, res.params.order, res.params.how)
      },
      err => console.error(err)
    )
  }

  getJobsByPage(page:number, order?:string, how?:string) {
    // const start = 10 * (this.page - 1)
    this.jobService.getJobsPerPage(page, null, order, how).subscribe(
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
  
  selected(event) {
    console.log(event.source.value)
    this.sortValue = event.source.value
    const options = this.sorts[event.source.value]
    this.router.navigate([`../seeker/jobs/${this.page}`], {queryParams: {order:options.order, how:options.how}})
  }

  ngOnDestroy() {
    this._querySub.unsubscribe()
  }

}
