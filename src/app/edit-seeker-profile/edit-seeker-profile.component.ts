import { Component, OnInit } from '@angular/core'
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms'
import { Location, DatePipe } from '@angular/common'
import { Router } from '@angular/router'
import { EstablishmentValidatorDirective } from '../shared/establishment-validator.directive'
import { DuplicateValidatorDirective } from '../shared/duplicate-validator.directive'

import { SeekerService } from '../seeker.service'
import { CookieService } from 'ngx-cookie-service'

import { Seeker } from '../seeker'
// import { Tag } from '../tag'
import { contactValidator } from '../shared/contact-validator.directive'
import { dateValidator } from '../shared/date-validator.directive'
import { OptionsService } from '../options.service';

const level_options = [
  'Internship / OJT',
  'Fresh Grad / Entry Level',
  'Associate / Supervisor',
  'Mid-Senior Level / Manager',
  'Director / Executive'
]

const genders = [
  'Male',
  'Female',
  'Other'
]

const educations = [
  'Elementary',
  'High School',
  'Undergraduate',
  'Vocational',
  'Masteral',
  'Doctorate',
  'Self-taught'
]

@Component({
  selector: 'app-edit-seeker-profile',
  templateUrl: './edit-seeker-profile.component.html',
  styleUrls: ['./edit-seeker-profile.component.css']
})
export class EditSeekerProfileComponent implements OnInit {
  seeker: Seeker

  id:number
  level_options: string[]
  skill_options: string[]
  field_options: string[]
  education_options: string[]
  gender_options: string[]

  profileForm: FormGroup
  skills: FormArray
  fields: FormArray
  contact_no: FormControl
  gender: FormControl
  birthdate: FormControl
  education: FormControl
  level: FormControl
  salary_per_month: FormControl

  constructor(private location: Location,
              private seekerService: SeekerService,
              private establishmentValidatorDirective: EstablishmentValidatorDirective,
              private duplicateValidatorDirective: DuplicateValidatorDirective,
              private cookieService: CookieService,
              private optionService: OptionsService,
              private router: Router) { }

  ngOnInit() {
    this.seeker = new Seeker()
    this.optionService.loadData().subscribe(
      (res) => {
        this.field_options = res.data.fields
        this.skill_options = res.data.skills
        this.level_options = res.data.levels
        this.education_options = res.data.educations
        this.gender_options = res.data.genders
      },
      (err) => {
        console.error(err)
      }
    )
    this.id = +this.cookieService.get('user_id')
    this.getSeekerProfile(this.id)
    this.contact_no = new FormControl('', [
      contactValidator(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/)
    ])
    this.gender = new FormControl('')
    this.birthdate = new FormControl('', [
      this.establishmentValidatorDirective.establishmentValidator()
    ])
    this.education = new FormControl('')
    this.level = new FormControl('')
    this.salary_per_month = new FormControl(0)
    this.skills = new FormArray([], [
      this.duplicateValidatorDirective.duplicateValidator()
    ])
    this.fields = new FormArray([], [
      this.duplicateValidatorDirective.duplicateValidator()
    ])
    this.profileForm = new FormGroup({
      'contact_no': this.contact_no,
      'gender': this.gender,
      'birthdate': this.birthdate,
      'education': this.education,
      'level': this.level,
      'salary_per_month': this.salary_per_month,
      'skills': this.skills,
      'fields': this.fields
    })
  }

  setTags(tags: any[]) {
    for(let i = 0; i < tags.length; i++) {
      if(tags[i].tag_type === "skill") {
        console.log(tags[i].tag)
        this.skills.push(new FormControl(tags[i].tag, [Validators.required]))
      }
      else if(tags[i].tag_type === "field") {
        this.fields.push(new FormControl(tags[i].tag, [Validators.required]))
      } 
    }
  }

  getSeekerProfile(id:number) {
    this.seekerService.getSeekerProfile(id).subscribe(
      (res) => {
        console.log(res)
        const dp = new DatePipe(navigator.language)
        this.seeker = res.data
        this.profileForm.patchValue({
          'contact_no': res.data.contact_no,
          'gender': res.data.gender,
          'birthdate': dp.transform(new Date(res.data.birthdate), 'yyyy-MM-dd'),
          'education': res.data.education,
          'level': res.data.level,
          'salary_per_month': res.data.salary_per_month
        })
        this.setTags(res.data.tags)
      },
      (err) => {
        console.error(err)
      }
    )
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

  goBack() {
    this.location.back()
  }

  onSubmit() {
    console.log(this.profileForm.value)
    this.seeker = this.profileForm.value
    this.seeker.tags = []
    for(let i = 0; i < this.seeker.skills.length; i++) {
      console.log()
      this.seeker.tags.push({"tag": this.seeker.skills[i], "tag_type": "skill"})
    }
    for(let i = 0; i < this.seeker.fields.length; i++) {
      this.seeker.tags.push({"tag": this.seeker.fields[i], "tag_type": "field"})
    }
    delete this.seeker.skills
    delete this.seeker.fields
    this.seeker.birthdate = new Date(this.seeker.birthdate).getTime()
    // this.job_post.description = this.job_post.description.replace("\n", "<br>")

    console.log(this.seeker)
    this.seekerService.editSeekerProfile(this.id, this.seeker).subscribe(
      (res) => {
        console.log(res)
        alert("Seeker Profile Updated!")
        this.location.back()
      },
      (err) => {
        console.error(err)
      }
    )
  }
  
}
