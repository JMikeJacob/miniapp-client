import { Component, OnInit, Input } from '@angular/core'
import { Observable } from 'rxjs'
import { map, tap } from 'rxjs/operators'
import { Location, DatePipe } from '@angular/common'
import { FormGroup, FormControl, Validators, FormArray, AbstractControl, NgControlStatusGroup, ValidationErrors } from '@angular/forms'
import { JobService } from '../job.service'
import { Router, ActivatedRoute } from '@angular/router'
import { Tag } from '../tag'
import { dateValidator } from '../shared/date-validator.directive'
import { DuplicateValidatorDirective } from '../shared/duplicate-validator.directive'
import { OptionsService } from '../options.service'
import { EditJobPostService } from '../edit-job-post.service'

//testing
import { CookieService } from 'ngx-cookie-service'
import { Options } from 'selenium-webdriver/firefox';

// import { Levels } from '../levels'
// import { Types } from '../types'

@Component({
  selector: 'app-edit-job-post',
  templateUrl: './edit-job-post.component.html',
  styleUrls: ['./edit-job-post.component.css']
})
export class EditJobPostComponent implements OnInit {
  // jobs$: Observable<object>
  job: any
  type_options: string[]
  level_options: string[]
  skill_options: string[]
  field_options: string[]
  posted_by_id: number
  date_posted: number
  job_post: any

  jobForm: FormGroup 
  job_name: FormControl
  type: FormControl
  level: FormControl
  job_location: FormControl
  description: FormControl
  qualifications: FormControl
  date_deadline: FormControl
  is_open: FormControl
  
  skills: FormArray
  fields: FormArray
  tag: FormControl

  //testing
  id: number

  constructor(public jobService: JobService,
              private router: Router,
              private route: ActivatedRoute,
              private location: Location,
              private duplicateValidatorDirective: DuplicateValidatorDirective,
              private optionService: OptionsService,
              private editJobPostService: EditJobPostService,
              public cookieService: CookieService //testing
              ) { }

  ngOnInit() {
    this.job = {}
    this.optionService.loadData().subscribe(
      (res) => {
        this.field_options = res.data.fields
        this.skill_options = res.data.skills
        this.type_options = res.data.types
        this.level_options = res.data.levels
      },
      (err) => {
        console.error(err)
      }
    )
    this.route.params.subscribe((res) => {
      this.id = res.id
      this.getJobPost()
    })
    this.posted_by_id = +this.cookieService.get('posted_by_id') //testing
    
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
    this.qualifications = new FormControl('', [
      Validators.required
    ])
    this.date_deadline = new FormControl('', [
      Validators.required,
      dateValidator()
    ])
    this.is_open = new FormControl('', [
      Validators.required
    ])
    this.skills = new FormArray([], [
      this.duplicateValidatorDirective.duplicateValidator()
    ])
    this.fields = new FormArray([], [
      this.duplicateValidatorDirective.duplicateValidator()
    ])
    this.jobForm = new FormGroup({
      'job_name': this.job_name,
      'type': this.type,
      'level': this.level,
      'job_location': this.job_location,
      'description': this.description,
      'qualifications': this.qualifications,
      'date_deadline': this.date_deadline,
      'is_open': this.is_open,
      'skills': this.skills,
      'fields': this.fields
    })
    // this.getJobPost()
  }


  setTags(tags: Tag[]) {
    for(let i = 0; i < tags.length; i++) {
      if(tags[i].tag_type === "skill") {
        this.skills.push(new FormControl(tags[i].tag, [Validators.required]))
      }
      else if(tags[i].tag_type === "field") {
        this.fields.push(new FormControl(tags[i].tag, [Validators.required]))
      } 
    }
  }

  addSkill() {
    this.skills.push(new FormControl('', [Validators.required]))
  }

  delSkill(i:number) {
    this.skills.removeAt(i)
  }

  addField() {
    this.fields.push(new FormControl('', [Validators.required]))
  }

  delField(i:number) {
    this.fields.removeAt(i)
  }

  getJobPost() {
    this.jobService.getJobPost(this.id).subscribe(
      (res) => {
        console.log(res)
        const dp = new DatePipe(navigator.language)
        this.job = res.data
        this.jobForm.patchValue({
          job_name: res.data.job_name,
          type: res.data.type,
          level: res.data.level,
          job_location: res.data.job_location,
          description:res.data.description,
          qualifications: res.data.qualifications,
          date_deadline: dp.transform(new Date(res.data.date_deadline), 'yyyy-MM-dd'),
          is_open: res.data.is_open
        })
        this.setTags(res.data.tags)
      },
      (err) => {
        console.error(err)
        // console.log("yo")
      }
    )
  }

  // getJobPost() {
  //   this.job = this.editJobPostService.getJob()
  //   console.error(this.job)
  //   const dp = new DatePipe(navigator.language)
  //   this.jobForm.patchValue({
  //     job_name: this.job.job_name,
  //     type: this.job.type,
  //     level: this.job.level,
  //     job_location: this.job.job_location,
  //     description:this.job.description,
  //     qualifications: this.job.qualifications,
  //     date_deadline: dp.transform(new Date(this.job.date_deadline), 'yyyy-MM-dd'),
  //     is_open: this.job.is_open
  //   })
  //   this.setTags(this.job.tags)
  // }

  onSubmit() {
    console.log(this.jobForm.value)
    this.job_post = this.jobForm.value
    this.job_post.tags = []
    for(let i = 0; i < this.job_post.skills.length; i++) {
      console.log()
      this.job_post.tags.push({"tag": this.job_post.skills[i], "tag_type": "skill"})
    }
    for(let i = 0; i < this.job_post.fields.length; i++) {
      this.job_post.tags.push({"tag": this.job_post.fields[i], "tag_type": "field"})
    }
    delete this.job_post.skills
    delete this.job_post.fields
    this.job_post.posted_by_id = this.posted_by_id
    this.job_post.date_deadline = new Date(this.job_post.date_deadline).getTime()
    console.log(new Date(this.job_post.date_deadline))
    this.job_post.date_posted = new Date().getTime()
    this.job_post.company = this.cookieService.get('company') //testing

    // this.job_post.description = this.job_post.description.replace("\n", "<br>")

    console.log(this.job_post)
    this.jobService.editJobPost(this.id, this.job_post).subscribe(
      (res) => {
        console.log(res)
        alert("Job Post Updated!")
        this.location.back()
      },
      (err) => {
        console.error(err)
      }
    )
  }

  goBack() {
    this.location.back()
  }
}
