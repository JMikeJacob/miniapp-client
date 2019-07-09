import { Component, OnInit, Input } from '@angular/core'
import { Job } from '../job'

@Component({
  selector: 'app-job-ad',
  templateUrl: './job-ad.component.html',
  styleUrls: ['./job-ad.component.css']
})
export class JobAdComponent implements OnInit {

  @Input() job:Job

  constructor() { }

  ngOnInit() {
  }

}
