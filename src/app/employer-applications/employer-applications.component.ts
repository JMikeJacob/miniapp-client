import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { Observable } from 'rxjs'
import { ActivatedRoute, Router } from '@angular/router'
import { PageEvent } from '@angular/material/paginator'

import { CookieService } from 'ngx-cookie-service'

import { Job } from '../job'
import { JobService } from '../job.service'
@Component({
  selector: 'app-employer-applications',
  templateUrl: './employer-applications.component.html',
  styleUrls: ['./employer-applications.component.css']
})
export class EmployerApplicationsComponent implements OnInit {
  apps: any[]
  count: Observable<any>
  page: number
  id: number
  pageEvent = PageEvent

  constructor(public jobService: JobService,
              private route: ActivatedRoute,
              private router: Router,
              public cookieService: CookieService
            ) { }

  ngOnInit() {
    // this.count = NaN
    // this.getPageNumber()
    this.apps = []
    this.route.params.subscribe((res) => {
      this.page = res.page
      this.id = +this.cookieService.get('posted_by_id')
      if(isNaN(this.page)) {
        this.router.navigate(['/../apps', 1])
        //navigate to error page
      }
      else if(!this.page || this.page === 0) {
        this.page = 1
      }
      this.getAppsByPage(this.id, this.page)
    })
  }

  getAppsByPage(id:number, page:number) {
    // const start = 10 * (this.page - 1)
    this.jobService.getApplicationsEmployer(id, page).subscribe(
      (res) => {
        console.log(res.data)
        this.count = res.data.count
        this.apps = res.data.apps
      },
      (err) => {
        console.error(err)
      }
    )
  }

  loadPage(event?: PageEvent) {
    this.router.navigate([`../apps/`, event.pageIndex + 1])
  }
}
