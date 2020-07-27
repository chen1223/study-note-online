import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-note-detail',
  templateUrl: './note-detail.component.html',
  styleUrls: ['./note-detail.component.scss']
})
export class NoteDetailComponent implements OnInit {

  mode: string;
  title: string;
  form = this.fb.group({
    title: ['', [Validators.required]]
  });

  constructor(public readonly location: Location,
              public readonly activatedRoute: ActivatedRoute,
              public readonly fb: FormBuilder) { }

  ngOnInit(): void {
    this.setMode();
  }

  /**
   * Set mode
   */
  setMode(): void {
    this.activatedRoute.data.subscribe(data => {
      this.mode = data.mode;
      switch (this.mode) {
        case 'create':
          this.title = 'New Note';
          // Set focus to the title input
          setTimeout(() => {
            const titleEl = document.querySelector('.--title .ctrl') as HTMLInputElement;
            titleEl.focus();
          }, 0);
          break;
          break;
        case 'view':
          this.title = 'View Note';
          break;
        case 'update':
          this.title = 'Update Note';
          break;
      }
    });
  }

  back(): void {
    this.location.back();
  }

  // On user clicks on the cancel button
  onCancel(): void {

  }

  // On user clicks on the save button
  onSubmit(): void {

  }
}
