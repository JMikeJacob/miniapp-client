import { Component, OnInit, Input } from '@angular/core'
import { Location, DatePipe } from '@angular/common'
import { FormGroup, FormControl, Validators, Form } from '@angular/forms'
import { JobService } from '../job.service'
import { Router, ActivatedRoute } from '@angular/router'
import { Company } from '../company'
import { contactValidator } from '../shared/contact-validator.directive'
import { dateValidator } from '../shared/date-validator.directive'
import { EstablishmentValidatorDirective } from '../shared/establishment-validator.directive'
import { EditCompanyService } from '../edit-company.service'

//testing
import { CompanyService } from '../company.service'
import { CookieService } from 'ngx-cookie-service'

@Component({
  selector: 'app-edit-company',
  templateUrl: './edit-company.component.html',
  styleUrls: ['./edit-company.component.css']
})
export class EditCompanyComponent implements OnInit {
  company: Company
  type_options: string[]
  level_options: string[]
  posted_by_id: number
  date_posted: number
  qualifications: string //temporary
  email: string

  companyForm: FormGroup 
  name: FormControl
  website: FormControl
  location: FormControl
  establishment_date: FormControl
  description: FormControl
  contact_no: FormControl
  //testing
  id: number

  constructor(public jobService: JobService,
              private router: Router,
              private route: ActivatedRoute,
              private Location: Location,
              public companyService: CompanyService,
              private establishmentValidatorDirective: EstablishmentValidatorDirective,
              private editCompanyService: EditCompanyService,
              public cookieService: CookieService //testing
              ) { }

  ngOnInit() {
    this.posted_by_id = +this.cookieService.get('posted_by_id') //testing
    // this.type_options = this.types.types
    // this.level_options = this.levels.levels
    this.qualifications = "" //temp
    this.name = new FormControl('', [
      Validators.required
    ])
    this.website = new FormControl('')
    this.location = new FormControl('')
    this.description = new FormControl('')
    // this.qualifications = new FormControl('', [
    //   Validators.required
    // ])
    this.establishment_date = new FormControl('', [
      this.establishmentValidatorDirective.establishmentValidator()
    ])
    this.contact_no = new FormControl('', [
      Validators.required,
      contactValidator(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/)
    ])
    this.companyForm = new FormGroup({
      'name': this.name,
      'website': this.website,
      'location': this.location,
      'description': this.description,
      'establishment_date': this.establishment_date,
      'contact_no': this.contact_no
    })
    this.getCompanyProfile(this.posted_by_id)
  }

  getCompanyProfile(id:number) {
    this.editCompanyService.loadCompany("edit", id).subscribe(
      (res) => {
        console.log(res)
        const dp = new DatePipe(navigator.language)
        this.company = res.success.data
        this.email = res.success.data.email
        let estdate = res.success.data.establishment_date || null
        if(estdate) estdate = dp.transform(new Date(res.success.data.establishment_date), 'yyyy-MM-dd')
        this.companyForm.patchValue({
          name: res.success.data.name,
          website: res.success.data.website,
          location: res.success.data.location,
          description:res.success.data.description,
          establishment_date: estdate,
          contact_no: res.success.data.contact_no
        })
      },
      (err) => {
        console.error(err)
        // console.log("yo")
      }
    )
  }

  onSubmit() {
    console.log(this.companyForm.value)
    this.companyForm.value.establishment_date = new Date(this.companyForm.value.establishment_date).getTime()
    this.companyService.editCompanyProfile(this.posted_by_id, this.companyForm.value).subscribe(
      (res) => {
        console.log(res)
        const company = this.companyForm.value
        company.email = this.email
        company.posted_by_id = this.posted_by_id
        this.editCompanyService.sendCompany(this.companyForm.value)
        alert("Company Profile Updated!")
        this.Location.back()
      },
      (err) => {
        console.error(err)
      }
    )
  }

  goBack() {
    this.Location.back()
  }
}
