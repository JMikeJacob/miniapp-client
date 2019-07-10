import { Injectable } from '@angular/core';
import { Job } from './job'

@Injectable({
  providedIn: 'root'
})
export class EditJobPostService {

  job: Job

  constructor() { }

  loadJob(job: Job) {
    this.job = job
    console.log(job)
    return
  }

  getJob() {
    return this.job
  }
}
