import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-seeker-app-item',
  templateUrl: './seeker-app-item.component.html',
  styleUrls: ['./seeker-app-item.component.css']
})
export class SeekerAppItemComponent implements OnInit {
  @Input() app: any

  post_closed: boolean

  constructor() { }

  ngOnInit() {
    if(!this.app.is_open && this.app.status==="pending") {
      this.post_closed = true
    }
    else {
      this.post_closed = false
    }

  }

}
