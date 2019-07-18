import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, Form, FormArray } from '@angular/forms'
import { Router } from '@angular/router'
import { QuillEditorComponent } from 'ngx-quill'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'

import { dateValidator } from '../shared/date-validator.directive'
import { DuplicateValidatorDirective } from '../shared/duplicate-validator.directive'
import { OptionsService } from '../options.service'
import { JobService } from '../job.service'
import { CookieService } from 'ngx-cookie-service'

@Component({
  selector: 'app-create-job-post',
  templateUrl: './create-job-post.component.html',
  styleUrls: ['./create-job-post.component.css']
})
export class CreateJobPostComponent implements OnInit {
  // levels: Levels
  // types: Types
  @Input() job_Id: number

  skill_options: string[]
  field_options: string[]
  type_options: string[]
  level_options: string[]
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
  tag: FormControl
  skills: FormArray
  fields: FormArray

  @ViewChild('descriptionQuill', {
    static: true
  }) descriptionQuill: QuillEditorComponent

  @ViewChild('qualificationsQuill', {
    static: true
  }) qualificationsQuill: QuillEditorComponent

  //testing
  id: number

  constructor(public jobService: JobService,
              private router: Router,
              private duplicateValidatorDirective: DuplicateValidatorDirective,
              private optionService: OptionsService,
              public cookieService: CookieService //testing
              ) { }

  ngOnInit() {
    this.posted_by_id = +this.cookieService.get('posted_by_id') //testing
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
      'skills': this.skills,
      'fields': this.fields
    })

    this.jobForm.controls.description.valueChanges.pipe(
        debounceTime(400),
        distinctUntilChanged()
      ).subscribe()

    this.descriptionQuill.onContentChanged.pipe(
        debounceTime(400),
        distinctUntilChanged()
      ).subscribe()

    this.jobForm.controls.qualifications.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe()

    this.qualificationsQuill.onContentChanged.pipe(
        debounceTime(400),
        distinctUntilChanged()
      ).subscribe()
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
