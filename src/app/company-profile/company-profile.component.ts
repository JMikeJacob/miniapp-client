import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { Location } from '@angular/common'
//testing
import { CookieService } from 'ngx-cookie-service'
import { JobService } from '../job.service'
import { CompanyService } from '../company.service'
import { Company } from '../company'

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css']
})
export class CompanyProfileComponent implements OnInit {
  @Input() company: Company
  no_company: boolean
  id: number
  constructor(
    private jobService: JobService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private companyService: CompanyService,
    private cookieService: CookieService //testing
  ) { }

  ngOnInit() {
    this.no_company = true
    this.route.params.subscribe(
      (res) => {
        this.id = res.id
        this.getCompanyProfile(res.id)
      }
    )
  }

  getCompanyProfile(id:number) {
    this.companyService.getCompanyProfile(id).subscribe(
      (res) => {
        this.no_company = false
        this.company = res.success.data

        console.log(this.company)
        if(!this.company.website) this.company.website="URL not provided."
        if(!this.company.location) this.company.location="Location not provided."
        if(!this.company.description) this.company.description="Description not provided."
      },
      (err) => {
        console.error(err)
        // console.log("yo")
        this.no_company = true
      }
    )
  }

  toEdit() {
    this.router.navigate([`../employer/company/edit`])
  }

  goBack() {
    this.location.back()
  }
}
