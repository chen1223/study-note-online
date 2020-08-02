import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { QuillEditorComponent, QuillToolbarConfig } from 'ngx-quill';

@Component({
  selector: 'app-note-detail',
  templateUrl: './note-detail.component.html',
  styleUrls: ['./note-detail.component.scss']
})
export class NoteDetailComponent implements OnInit, AfterViewInit {

  mode: string;
  title: string;

  toolbarConfig: QuillToolbarConfig = [
    [
      'bold', 'italic', 'underline', 'strike',
      {
        color: [
          '#000',
          '#49C9DD',
          '#FF7C7C',
          '#49DDA2'
        ]
      },
      {
        background: [
          '#49C9DD',
          '#FF7C7C',
          '#49DDA2'
        ]
      },
      'clean'
    ]
  ];

  // Current ink color: black, red, blue
  currentColor = 'black';
  form = this.fb.group({
    title: ['', [Validators.required]]
  });

  @ViewChild('quillEditor') quillEditor: QuillEditorComponent;

  constructor(public readonly location: Location,
              public readonly activatedRoute: ActivatedRoute,
              public readonly fb: FormBuilder) { }

  ngOnInit(): void {
    this.setMode();
  }

  ngAfterViewInit(): void {
    this.setQuillEditor();
  }

  setQuillEditor(): void {
    this.quillEditor.modules = {
      toolbar: this.toolbarConfig
    };
    this.quillEditor.placeholder = '';
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
