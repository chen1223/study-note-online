import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from '../profile.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  profileId = null;
  profileData = null;

  constructor(public readonly activatedRoute: ActivatedRoute,
              public readonly profileService: ProfileService,
              public readonly location: Location) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      this.profileId = id;
      this.getData();
    })
  }

  back(): void {
    this.location.back();
  }

  /**
   * Get profile data
   */
  getData(): void {
    this.profileService.getProfile(this.profileId)
        .subscribe(
          res => {
            const dataKey = 'data';
            const data = res[dataKey];
            this.profileData = data;
          },
          err => {
            if (err.error) {
              console.error(err.error);
            }
          }
        );
  }
}
