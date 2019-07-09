import { Component, OnInit } from '@angular/core'
import { Seeker } from '../seeker'
import { SeekerService } from '../seeker.service'
import { CookieService } from 'ngx-cookie-service'

@Component({
  selector: 'app-seeker-profile',
  templateUrl: './seeker-profile.component.html',
  styleUrls: ['./seeker-profile.component.css']
})
export class SeekerProfileComponent implements OnInit {

  seeker:Seeker
  id: number

  constructor(private seekerService: SeekerService,
              private cookieService: CookieService) { }

  ngOnInit() {
    this.id = +this.cookieService.get('user_id')
    this.getSeekerProfile(this.id)
  }
  
  getSeekerProfile(id:number) {
    this.seekerService.getSeekerProfile(id).subscribe(
      (res) => {
        console.log(res)
      },
      (err) => {
        console.error(err)
      }
    )
  }
}
