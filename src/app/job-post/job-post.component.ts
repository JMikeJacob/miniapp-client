import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { Location } from '@angular/common'

import { JobService } from '../job.service'
import { Job } from '../job'



@Component({
  selector: 'app-job-post',
  templateUrl: './job-post.component.html',
  styleUrls: ['./job-post.component.css']
})
export class JobPostComponent implements OnInit {
  @Input() job: Job
  no_job: boolean
  skills: string[]
  fields: string[]
  constructor(
    private jobService: JobService,
    private route: ActivatedRoute,
    private location: Location  
  ) { }

  ngOnInit() {
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
      },
      (err) => {
        console.error(err)
        // console.log("yo")
        this.no_job = true
      }
    )
  }

  goBack() {
    this.location.back()
  }
}
