import { Component, OnInit } from '@angular/core'
import { Observable } from 'rxjs'
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
  skills: string[]
  fields: string[]

  constructor(private seekerService: SeekerService,
              private cookieService: CookieService) { }

  ngOnInit() {
    this.skills = []
    this.fields = []
    this.seeker = new Seeker()
    this.id = +this.cookieService.get('user_id')
    this.getSeekerProfile(this.id)
  }
  
  getSeekerProfile(id:number) {
    this.seekerService.getSeekerProfile(id).subscribe(
      (res) => {
        console.log(res)
        this.seeker = res.data
        for(let i = 0; i < this.seeker.tags.length; i++) {
          if(this.seeker.tags[i].tag_type === "skill") {
            this.skills.push(this.seeker.tags[i].tag)
          }
          else if(this.seeker.tags[i].tag_type === "field") {
            this.fields.push(this.seeker.tags[i].tag)
          }
        }
      },
      (err) => {
        console.error(err)
      }
    )
  }
}
