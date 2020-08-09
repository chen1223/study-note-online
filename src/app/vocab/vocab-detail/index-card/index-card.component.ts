import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-index-card',
  templateUrl: './index-card.component.html',
  styleUrls: ['./index-card.component.scss']
})
export class IndexCardComponent implements OnInit, OnChanges {
  @Input() mode = ''; // View / Update / Create
  @Input() vocabs = this.fb.array([]); // FormArray of vocabs
  @Input() presentationMode = false; // Presentation Mode / Show All

  // Carousel related variables
  currentIndex = 0; // Index in vocabs array
  selectedVocab = null;

  carouselItemArray = [{}, {}, {}];
  selectedIndex = 0;
  nextIndex = 1;
  prevIndex = 2;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    // tslint:disable-next-line: no-string-literal
    if (changes['presentationMode']['currentValue'] === true) {
      this.initCarousel();
    }
  }

  /**
   * Flip the card
   */
  flipCard(index): void {
    const frontOnTopCtrl = this.vocabs.at(index).get('frontOnTop');
    frontOnTopCtrl.setValue(!frontOnTopCtrl.value);
  }

  /**
   * On remove button click
   */
  onRemoveClick(index): void {
    this.vocabs.removeAt(index);
  }

  /**
   * Initialize carousel list
   */
  initCarousel(): void {
    this.currentIndex = 0;
    this.selectedVocab = (this.vocabs.at(this.currentIndex) as FormGroup).getRawValue();
  }

  // On user clicks on the carousel flip button
  onCarouselFlip(): void {
    console.log('on carousel flip');
    this.selectedVocab.frontOnTop = !this.selectedVocab.frontOnTop;
  }

  // On user clicks on the carousel prev or next button
  onCarouselRotate(direction: string): void {
    console.log('on carousel rotate', direction);
    const step = direction === 'next' ? 1 : -1;
    const size = this.carouselItemArray.length;
    this.selectedIndex = (this.selectedIndex + step + size) % size;
    this.nextIndex = (this.nextIndex + step + size) % size;
    this.prevIndex = (this.prevIndex + step + size) % size;
    const newIndex = (this.currentIndex + step + this.vocabs.length) % this.vocabs.length;
    this.currentIndex = newIndex;
    this.selectedVocab = (this.vocabs.at(this.currentIndex) as FormGroup).getRawValue();
  }

}
