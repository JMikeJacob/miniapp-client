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
  constructor(
    private jobService: JobService,
    private route: ActivatedRoute,
    private location: Location  
  ) { }

  ngOnInit() {
    this.no_job = true
    this.getJobPost()
  }

  getJobPost() {
    const id = +this.route.snapshot.paramMap.get('id')
    this.jobService.getJobPost(id).subscribe(
      (res) => {
        console.log(res)
        this.no_job = false
        this.job = res.data
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
