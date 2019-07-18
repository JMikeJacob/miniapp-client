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
  resume_url: string
  pic_url: string
  skills: string[]
  fields: string[]

  constructor(private seekerService: SeekerService,
              private location: Location,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.pic_url = '../../assets/img/placeholder.png'
    this.resume_url = "none"
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
        if(res.data.tags) {
          for(let i = 0; i < res.data.tags.length; i++) {
            if(res.data.tags[i].tag_type === "skill") {
              this.skills.push(res.data.tags[i].tag)
            }
            else if(res.data.tags[i].tag_type === "field") {
              this.fields.push(res.data.tags[i].tag)
            }
          }
        }
        if(res.data.pic_url) {
          if(res.data.pic_url !== "") {
            this.pic_url = res.data.pic_url
          }
        }
        if(res.data.resume_url) {
          if(res.data.resume_url !== "") {
            this.resume_url = res.data.resume_url
          }
        }
      },
      (err) => {
        console.error(err)
      }
    )
  }

  getResume() {
    window.open(this.resume_url, "_blank")
  }
}
