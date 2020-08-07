import { FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { VocabService } from './../vocab.service';
import * as moment from 'moment';

@Component({
  selector: 'app-vocab-detail',
  templateUrl: './vocab-detail.component.html',
  styleUrls: ['./vocab-detail.component.scss']
})
export class VocabDetailComponent implements OnInit {
  form = this.fb.group({
    title: [null, [Validators.required]],
    vocabs: this.fb.array([]),
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

  mode: string;
  title: string;

  // Vocab id
  vocabId;

  constructor(public readonly location: Location,
              public readonly fb: FormBuilder,
              public vocabService: VocabService,
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
      console.log('mode', data.mode);
      switch (this.mode) {
        case 'create':
          this.title = 'New Vocabulary Pack';
          this.resetForm();
          this.form.enable();
          this.addVocab(false);
          // Set focus to the title input
          setTimeout(() => {
            const titleEl = document.querySelector('.--title .ctrl') as HTMLInputElement;
            if (titleEl) {
              titleEl.focus();
            }
          }, 0);
          break;
        case 'view':
          this.activatedRoute.paramMap.subscribe(params => {
            const id = params.get('id');
            this.vocabId = id;
            this.getVocab(id);
            this.form.disable();
          });
          break;
        case 'update':
          this.activatedRoute.paramMap.subscribe(params => {
            const id = params.get('id');
            this.vocabId = id;
            this.getVocab(id);
          });
          break;
      }
    });
  }

  /**
   * Get vocab data from API
   */
  getVocab(id): void {
    // Reset form
    this.resetForm();
    this.vocabService.getVocabPack(id)
        .subscribe(
          res => {
            console.log('form before', this.form);
            const data = res['data'];
            data['_publishedDate'] = moment(new Date(data['publishedDate'])).format('MMM DD, YYYY');
            this.form.patchValue(data);
            (this.form.get('vocabs') as FormArray).clear();
            this.title = this.form.get('title').value;
            const vocabs = data['vocabs'];
            if (vocabs) {
              vocabs.forEach(vocab => {
                this.addVocab(false, vocab);
              });
            }
          },
          err => {}
        );
  }

  /**
   * Reset the form
   */
  resetForm(): void {
    this.form.reset();
    (this.form.get('vocabs') as FormArray).clear();
  }

  /**
   * Add one vocab item to the FormArray
   */
  addVocab(focus = true, data?): void {
    console.log('addVocab');
    const group = this.fb.group({
      vocab: ['', [Validators.required]],
      desc: ['', [Validators.required]],
      frontOnTop: [true]
    });
    if (data) {
      group.patchValue(data);
    }
    (this.form.get('vocabs') as FormArray).push(group);
    if (focus) {
      setTimeout(() => {
        // Set focus on the the card we just added
        const newCardCtrl = document.querySelector('.card-wrapper:last-child .card--front .ctrl') as HTMLInputElement;
        if (newCardCtrl) {
          newCardCtrl.focus();
        }
      }, 0);
    }
  }

  /**
   * On like button click
   */
  onLike(): void {
    console.log('on like');
  }

  /**
   * On save button click
   */
  onSave(): void {
    console.log('on save');
  }

  back(): void {
    this.location.back();
  }

  /**
   * On cancel click
   */
  onCancel(): void {

  }

  /**
   * Validate form
   *   1. Title cannot be empty
   *   2. Must have at least one index card in the form array
   */
  isFormValid(): boolean {
    // Mark form as touched
    this.form.markAllAsTouched();
    // Title verification
    const titleCtrl = this.form.get('title');
    let titleValid = false;
    if (!titleCtrl.value) {
      const titleCtrl = document.querySelector('input.title-ctrl') as HTMLInputElement;
      titleCtrl.focus();
      return titleValid;
    }
    titleValid = true;
    // Vocab verification
    let atLeastOneValid = false;
    const vocabArrays = this.form.get('vocabs') as FormArray;
    if (vocabArrays.length === 0) {
      return atLeastOneValid;
    }
    for (let i = 0; i < vocabArrays.length; i++) {
      const vocabGroup = vocabArrays.at(i);
      const vocab = vocabGroup.get('vocab');
      const desc = vocabGroup.get('desc');
      if (vocab.valid && desc.valid) {
        atLeastOneValid = true;
        break;
      } else if (vocab.invalid) {
        const vocabCtrl = document.querySelectorAll('input.vocab')[i] as HTMLInputElement;
        vocabCtrl.focus();
      } else if (desc.invalid) {
        const descCtrl = document.querySelectorAll('textarea.desc')[i] as HTMLTextAreaElement;
        descCtrl.focus();
      }
    }
    return titleValid && atLeastOneValid && this.form.valid;
  }

  /**
   * On form submit
   */
  onSubmit(): void {
    const valid = this.isFormValid();
    if (!valid) {
      return;
    }
    const body = this.form.getRawValue();
    const apiCall = this.mode === 'create' ? this.vocabService.postVocab(body) : this.vocabService.patchVocab(body);
    apiCall.subscribe(
      res => {},
      err => {}
    );
  }
}
