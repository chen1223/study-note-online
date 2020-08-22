import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { QuillEditorComponent, QuillToolbarConfig } from 'ngx-quill';
import { NoteService } from './../note.service';
import * as moment from 'moment';

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

  // Current note id
  noteId = null;

  likeHovered = false;
  saveHovered = false;

  // Current ink color: black, red, blue
  currentColor = 'black';
  form = this.fb.group({
    title: ['', [Validators.required]],
    note: ['', [Validators.required]],
    publishedDate: [null],
    _publishedDate: [null],
    likes: [null],
    saves: [null],
    author: this.fb.group({
      name: [null],
      username: [null],
      profilePic: [null]
    })
  });

  @ViewChild('quillEditor') quillEditor: QuillEditorComponent;

  constructor(public readonly location: Location,
              public readonly activatedRoute: ActivatedRoute,
              public readonly fb: FormBuilder,
              public readonly noteService: NoteService) { }

  ngOnInit(): void {
    this.setMode();
  }

  ngAfterViewInit(): void {
    if (this.mode !== 'view') {
      this.setQuillEditor();
    }
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
            if (titleEl) {
              titleEl.focus();
            }
          }, 0);
          break;
        case 'view':
          this.title = 'View Note';
          this.activatedRoute.paramMap.subscribe(params => {
            const id = params.get('id');
            this.noteId = id;
            this.getData(id);
            this.form.disable();
          });
          break;
        case 'update':
          this.title = 'Update Note';
          this.activatedRoute.paramMap.subscribe(params => {
            const id = params.get('id');
            this.noteId = id;
            this.getData(id);
          });
          break;
      }
    });
  }

  /**
   * Get data from Backend API
   */
  getData(id): void {
    this.noteService.getNote(id)
        .subscribe(
          res => {
            console.log('get note data', res);
            const dataKey = 'data';
            const data = res[dataKey];
            data['_publishedDate'] = moment(new Date(data['publishedDate'])).format('MMM DD, YYYY');
            this.form.patchValue(data);
            this.title = data.title;
          },
          err => {
            if (err.error) {
              console.error(err.error);
            }
          }
        );
  }

  back(): void {
    this.location.back();
  }

  /**
   * On like button click
   */
  onLike(): void {
    console.log('on like');
  }

  /**
   * On save button click (Save this note to personal profile)
   */
  onSave(): void {
    console.log('on save');
  }

  // On user clicks on the cancel button
  onCancel(): void {

  }

  // Verify if the form is valid
  isFormValid(): boolean {
    return this.form.get('title').valid && this.form.get('note').valid;
  }

  // On user clicks on the save button (Save changes of this note)
  onSubmit(): void {
    console.log(this.form.getRawValue(), this.quillEditor);
    if (!this.isFormValid()) {
      return;
    }
    const body = this.form.getRawValue();
    const apiCall = this.mode === 'create' ? this.noteService.postNote(body) : this.noteService.patchNote(body);
    apiCall.subscribe(
      res => {},
      err => {
        if (err.error) {
          console.log(err.error);
        }
      }
    );
  }
}
