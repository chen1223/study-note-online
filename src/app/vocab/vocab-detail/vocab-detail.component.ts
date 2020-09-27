import { LoadingService } from './../../share/services/loading.service';
import { FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { Location, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { VocabService } from './../vocab.service';
import * as moment from 'moment';
import { LoginService } from 'src/app/core/login-dialog/login.service';

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

  // view / update / create
  mode: string;
  title: string;
  vocabData;

  /**
   * Presentation mode:
   *   true: in presentation mode
   *   false: in show all mode
   */
  presentationMode = false;

  // Vocab id
  vocabId = null;

  likeHovered = false;
  saveHovered = false;

  isBrowser: boolean;

  isVocabLoaded = false;
  isAuthor = false;

  constructor(public readonly location: Location,
              public readonly fb: FormBuilder,
              public vocabService: VocabService,
              public readonly activatedRoute: ActivatedRoute,
              private loadingService: LoadingService,
              private router: Router,
              @Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

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
   * Load data and init form
   */
  initForm(): void {
    this.isAuthor = this.vocabData.isAuthor;

    // Format publishedDate
    const publishedDateKey = 'publishedDate';
    this.vocabData._publishedDate =
      this.vocabData[publishedDateKey] ? moment(new Date(this.vocabData[publishedDateKey])).format('MMM DD, YYYY') : '';

    // Set profile picture
    this.vocabData.author.profilePic = this.vocabData.author.picture;
    this.form.patchValue(this.vocabData);
    (this.form.get('vocabs') as FormArray).clear();
    this.title = this.form.get('title').value;
    const vocabs = this.vocabData.vocabs;
    if (vocabs) {
      vocabs.forEach(vocab => {
        this.addVocab(false, vocab);
      });
    }
  }

  /**
   * Get vocab data from API
   */
  getVocab(id): void {
    // Reset form
    this.resetForm();
    this.loadingService.show();
    this.vocabService.getVocabPack(id)
        .subscribe(
          (res: any) => {
            this.loadingService.hide();
            this.isVocabLoaded = true;
            this.vocabData = res;
            this.initForm();
          },
          err => {
            this.loadingService.hide();
            this.isVocabLoaded = false;
            this.router.navigateByUrl('');
          }
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
      id: [''],
      name: ['', [Validators.required]],
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
   * On save button click (Save this vocab to personal profile)
   */
  onSave(): void {
    console.log('on save');
  }

  /**
   * On user clicks on the edit button
   */
  onEdit(): void {
    this.mode = 'update';
    this.form.enable();
    this.location.go(`/vocab/update/${this.vocabId}`);
  }

  /**
   * On user clicks on the publish button
   */
  onPublished(): void {
    this.loadingService.show('Publishing...');
    this.vocabService.putVocabStatus(this.vocabId, 'published')
        .subscribe(
          (res: any) => {
            this.loadingService.hide();
            const publishedDate = res.publishedDate;
            const formattedDate = res.publishedDate ? moment(res.publishedDate).format('MMM DD, YYYY') : '';
            this.form.get('publishedDate').setValue(publishedDate);
            this.form.get('_publishedDate').setValue(formattedDate);
          },
          err => {
            this.loadingService.hide();
            this.form.get('publishedDate').reset();
            this.form.get('_publishedDate').reset();
          }
        );
  }

  back(): void {
    this.location.back();
  }

  // On presentation mode button click
  toggleMode(): void {
    this.presentationMode = !this.presentationMode;
    if (this.isBrowser) {
      if (this.presentationMode) {
        setTimeout(() => {
          const card = document.querySelector('.carousel-item.--selected') as HTMLLIElement;
          card.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }, 0);
      } else {
        setTimeout(() => {
          const card = document.querySelector('.card-wrapper:first-child') as HTMLLIElement;
          card.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }, 0);
      }
    }
  }

  /**
   * On cancel click
   */
  onCancel(): void {
    if (this.mode === 'create') {
      this.router.navigateByUrl('');
    } else if (this.mode === 'update') {
      this.initForm();
      this.mode = 'view';
      this.form.disable();
      this.location.go(`/vocab/view/${this.vocabId}`);
    }
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
      const titleInput = document.querySelector('input.title-ctrl') as HTMLInputElement;
      titleInput.focus();
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
      const name = vocabGroup.get('name');
      const desc = vocabGroup.get('desc');
      if (name.valid && desc.valid) {
        atLeastOneValid = true;
        break;
      } else if (name.invalid) {
        const vocabCtrl = document.querySelectorAll('input.name')[i] as HTMLInputElement;
        vocabCtrl.focus();
      } else if (desc.invalid) {
        const descCtrl = document.querySelectorAll('textarea.desc')[i] as HTMLTextAreaElement;
        descCtrl.focus();
      }
    }
    return titleValid && atLeastOneValid && this.form.valid;
  }

  /**
   * On form submit (Save changes of this vocab)
   */
  onSubmit(): void {
    const valid = this.isFormValid();
    console.log('form valid', valid);
    if (!valid) {
      return;
    }
    const body = this.form.getRawValue();
    const apiCall = this.mode === 'create' ? this.vocabService.postVocab(body) : this.vocabService.patchVocab(this.vocabId, body);
    this.loadingService.show('Saving your vocabularies...');
    apiCall.subscribe(
      (res: any) => {
        this.loadingService.hide();
        this.vocabData = res;
        this.isVocabLoaded = true;
        this.vocabId = res.id;
        this.initForm();
        console.log('Vocab save response', res);
        const idKey = 'id';
        const packId = res[idKey];
        // TODO: Show successful message
        this.location.go(`/vocab/view/${packId}`);
        this.mode = 'view';
      },
      err => {
        this.loadingService.hide();
        console.log('Vocab save error', err);
      }
    );
  }
}
