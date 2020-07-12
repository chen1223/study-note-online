import { FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { Breadcrumb } from './../../share/breadcrumb/breadcrumb.component';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-vocab-detail',
  templateUrl: './vocab-detail.component.html',
  styleUrls: ['./vocab-detail.component.scss']
})
export class VocabDetailComponent implements OnInit {
  form = this.fb.group({
    title: ['', [Validators.required]],
    vocabs: this.fb.array([])
  });

  mode: string;
  title: string;

  constructor(public readonly location: Location,
              public readonly fb: FormBuilder,
              public readonly activatedRoute: ActivatedRoute) { }

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
          this.title = 'New Vocabulary Pack';
          this.addVocab();
          break;
        case 'view':
          this.title = 'View Vocabulary Pack';
          break;
        case 'update':
          this.title = 'Update Vocabulary Pack';
          break;
      }
    });
  }

  /**
   * Add one vocab item to the FormArray
   */
  addVocab(): void {
    (this.form.get('vocabs') as FormArray).push(this.fb.group({
      vocab: ['', [Validators.required]],
      desc: ['', [Validators.required]]
    }));
  }

  back(): void {
    this.location.back();
  }
}
