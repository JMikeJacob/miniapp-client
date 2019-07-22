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
  pic_url: string
  loading: boolean
  no_company: boolean
  id: number
  from:string
  constructor(
    private jobService: JobService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private companyService: CompanyService,
    private cookieService: CookieService //testing
  ) { }

  ngOnInit() {
    this.loading = true
    this.no_company = true
    this.route.params.subscribe(
      (res) => {
        this.id = res.id
        this.getCompanyProfile(res.id)
      }
    )
    this.route.queryParamMap.subscribe(
      (res:any) => {
        if(res.params.from) {
          this.from = res.params.from
        }
        else {
          this.from = ""
        }
      },
      (err) => {
        this.from = ""
      }
    )
  }

  getCompanyProfile(id:number) {
    this.companyService.getCompanyProfile(id).subscribe(
      (res) => {
        this.company = res.success.data
        console.log(this.company)
        if(!this.company.website) this.company.website="URL not provided."
        if(!this.company.location) this.company.location="Location not provided."
        if(!this.company.description) this.company.description="Description not provided."
        this.no_company = false
        this.loading = false
        if(res.success.data.pic_url) {
          if(res.success.data.pic_url === "") {
            this.pic_url = '../../assets/img/placeholder.png'
          }
          else {
            this.pic_url = res.success.data.pic_url
          }
        }
        else {
          this.pic_url = '../../assets/img/placeholder.png'
        }
      },
      (err) => {
        console.error(err)
        // console.log("yo")
        this.no_company = true
        this.loading = false
      }
    )
  }

  toEdit() {
    this.router.navigate([`../employer/company/edit`])
  }

  goBack() {
    this.location.back()
  }

  updateUrl(event) {
    if(this.company.pic_url_old !== "" && this.company.pic_url_old !== event.srcElement.currentSrc) {
      this.pic_url = this.company.pic_url_old
    }
    else {
      this.pic_url = '../../assets/img/placeholder.png'
    }
  }
}
