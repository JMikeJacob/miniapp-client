import { Component, OnInit } from '@angular/core'
import { Location } from '@angular/common'
import { Observable } from 'rxjs'
import { ActivatedRoute } from '@angular/router'
import { Seeker } from '../seeker'
import { SeekerService } from '../seeker.service'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  seeker:Seeker
  id: number
  skills: string[]
  fields: string[]

  constructor(private seekerService: SeekerService,
              private location: Location,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.skills = []
    this.fields = []
    this.seeker = new Seeker()
    this.id = +this.route.snapshot.paramMap.get('id')
    this.getSeekerProfile(this.id)
  }

  goBack() {
    this.location.back()
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
