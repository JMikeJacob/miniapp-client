import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, Form, FormArray } from '@angular/forms'
import { JobService } from '../job.service'
import { Router } from '@angular/router'
import { dateValidator } from '../shared/date-validator.directive'

//testing
import { CookieService } from 'ngx-cookie-service'

// import { Levels } from '../levels'
// import { Types } from '../types'

const levels = [
  'Internship / OJT',
  'Fresh Grad / Entry Level',
  'Associate / Supervisor',
  'Mid-Senior Level / Manager',
  'Director / Executive'
]

const types = [
  'Temporary',
  'Part-Time',
  'Full-Time',
  'Contract',
  'Freelance'
]

@Component({
  selector: 'app-create-job-post',
  templateUrl: './create-job-post.component.html',
  styleUrls: ['./create-job-post.component.css']
})
export class CreateJobPostComponent implements OnInit {
  // levels: Levels
  // types: Types
  @Input() job_Id: number

  type_options: string[]
  level_options: string[]
  posted_by_id: number
  date_posted: number
  qualifications: string //temporary
  job_post: any

  jobForm: FormGroup 
  job_name: FormControl
  type: FormControl
  level: FormControl
  job_location: FormControl
  description: FormControl
  // qualifications: FormControl
  date_deadline: FormControl
  tag: FormControl
  tags: FormArray

  //testing
  id: number

  constructor(public jobService: JobService,
              private router: Router,
              public cookieService: CookieService //testing
              ) { }

  ngOnInit() {
    this.posted_by_id = +this.cookieService.get('posted_by_id') //testing
    this.type_options = types
    this.level_options = levels
    // this.type_options = this.types.types
    // this.level_options = this.levels.levels
    this.qualifications = "" //temp
    this.tag = new FormControl('', [
      Validators.required
    ])
    this.job_name = new FormControl('', [
      Validators.required
    ])
    this.type = new FormControl('', [
      Validators.required
    ])
    this.level = new FormControl('', [ 
      Validators.required
    ])
    this.job_location = new FormControl('', [
      Validators.required
    ])
    this.description = new FormControl('', [
      Validators.required
    ])
    // this.qualifications = new FormControl('', [
    //   Validators.required
    // ])
    this.date_deadline = new FormControl('', [
      Validators.required,
      dateValidator()
    ])
    this.tags = new FormArray([])
    this.jobForm = new FormGroup({
      'job_name': this.job_name,
      'type': this.type,
      'level': this.level,
      'job_location': this.job_location,
      'description': this.description,
      'date_deadline': this.date_deadline,
      'tags': this.tags
    })
  }

  addTag() {
    this.tags.push(new FormControl('', [
      Validators.required
    ]))
    console.log(this.tags)
  }

  onSubmit() {
    console.log(this.jobForm.value)
    this.job_post = this.jobForm.value
    this.job_post.posted_by_id = this.posted_by_id
    this.job_post.qualifications = this.qualifications
    this.job_post.date_deadline = new Date(this.job_post.date_deadline).getTime()
    this.job_post.date_posted = new Date().getTime()
    this.job_post.company_name = this.cookieService.get('company') //testing

    // this.job_post.description = this.job_post.description.replace("\n", "<br/>")
    console.log(this.job_post)
    this.jobService.createJobPost(this.job_post).subscribe(
      (res) => {
        console.log(res)
        alert("Job Post Created!")
        this.router.navigate(['/employer/jobs/1'])
      },
      (err) => {
        console.error(err)
      }
    )
  }
}
