import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { Location } from '@angular/common'
//testing
import { CookieService } from 'ngx-cookie-service'
import { JobService } from '../job.service'
import { Job } from '../job'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { ChoiceModalComponent } from '../choice-modal/choice-modal.component'

import { NotificationService } from '../notification.service'

@Component({
  selector: 'app-seeker-job-post',
  templateUrl: './seeker-job-post.component.html',
  styleUrls: ['./seeker-job-post.component.css']
})
export class SeekerJobPostComponent implements OnInit {
  @Input() job: Job
  no_job: boolean
  open_modal: boolean
  has_clicked: boolean
  applied: string
  app_id: number
  user_id: number
  job_id: number
  skills: string[]
  fields: string[]
  constructor(
    private jobService: JobService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    public modalService: NgbModal,
    private notificationService: NotificationService,
    private cookieService: CookieService //testing
  ) { }

  ngOnInit() {
    this.open_modal = false
    this.has_clicked = false
    this.applied = "no"
    this.no_job = true
    this.skills = []
    this.fields = []
    this.getJobPost()
  }

  getJobPost() {
    const id = +this.route.snapshot.paramMap.get('id')
    this.jobService.getJobPost(id).subscribe(
      (res) => {
        console.log(res)
        this.no_job = false
        this.job = res.data
        for(let i = 0; i < this.job.tags.length; i++) {
          if(this.job.tags[i].tag_type === "skill") {
            this.skills.push(this.job.tags[i].tag)
          }
          else if(this.job.tags[i].tag_type === "field") {
            this.fields.push(this.job.tags[i].tag)
          }
        }
        this.job_id = res.data.job_id
        this.user_id = +this.cookieService.get('user_id')
        this.checkIfApplied()
      },
      (err) => {
        console.error(err)
        // console.log("yo")
        this.no_job = true
      }
    )
  }

  checkIfApplied() {
    this.jobService.checkIfApplied({job_id: this.job_id, user_id: this.user_id}).subscribe(
      (res) => {
        console.log(res)
        this.applied = res.applied
        this.app_id = res.app_id
      },
      (err) => {
        console.error(err)
      }
    )
  }

  apply() {
    if(!this.has_clicked) {
      this.has_clicked = true
      if(!this.open_modal){
        const modalRef = this.modalService.open(ChoiceModalComponent)
        modalRef.componentInstance.dialog = {
          header: "One last check...",
          message: "Do you REALLY want to apply for this job?",
          mode: "apply",
          job_name: this.job.job_name,
          company_name: this.job.company_name
        }
        this.open_modal = true
        console.log(modalRef.result)
        modalRef.result.then((res) => {
          if(res === "yes") {
            const post = new Date().getTime()
            this.jobService.applyForJob({job_id: this.job_id, 
                                        user_id: this.user_id, 
                                        posted_by_id: this.job.posted_by_id,
                                        date_posted: post
            }).subscribe(
              (res) => {
                console.log(res)
                this.app_id = res.app_id
                this.applied = "yes"
                this.notificationService.applyNotification({
                  to: this.job.posted_by_id,
                  from: this.user_id,
                  message: `New App Alert: Jobseeker#${this.user_id} just applied for ${this.job.job_name}`
                })
              },
              (err) => {
                console.log(err)
              }
            )
          }
          this.has_clicked = false
          this.open_modal=false
        }, () => {
          this.has_clicked = false
          this.open_modal=false
        })
      }
    }
  }

  withdraw() {
    if(!this.has_clicked) {
      this.has_clicked = true
      if(!this.open_modal){
        const modalRef = this.modalService.open(ChoiceModalComponent)
        modalRef.componentInstance.dialog = {
          header: "One last check...",
          message: "Do you REALLY want to withdraw your application?",
          mode: "apply",
          job_name: this.job.job_name,
          company_name: this.job.company_name
        }
        this.open_modal = true
        console.log(modalRef.result)
        modalRef.result.then((res) => {
          if(res === "yes") {
            this.jobService.deleteApplication(this.app_id).subscribe(
              (res) => {
                this.applied = "no"
              },
              (err) => {
                console.error(err)
                if(err.error.error.errorCode === 4003) {
                  alert("Judgment has already been passed.")
                }
              }
            )
          }
          this.has_clicked = false
          this.open_modal=false
        }, () => {
          this.has_clicked = false
          this.open_modal=false
        })
      }
    }
  }

  goBack() {
    this.location.back()
  }
}
