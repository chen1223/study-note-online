import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, Input, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-index-card',
  templateUrl: './index-card.component.html',
  styleUrls: ['./index-card.component.scss']
})
export class IndexCardComponent implements OnInit, AfterViewInit {
  @Input() mode = '';
  @Input() vocabs = this.fb.array([]); // FormArray of vocabs
  ratio = 795 / 466; // Index card Width : Height ratio

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.prepareData();
  }

  ngAfterViewInit(): void {
    this.renderCard();
  }

  // Render index card to correct ratio
  renderCard(): void {
    const cards = (document.querySelectorAll('.card-wrapper'));
    cards.forEach(card => {
      const width = (card as HTMLDivElement).clientWidth;
      const height = width / this.ratio;
      (card as HTMLDivElement).style.height = `${height}px`;
      const frontCard = card.querySelector('.card--front .card__body');
      const backCard = card.querySelector('.card--back .card__body');
      (frontCard as HTMLDivElement).style.height = `${height}px`;
      (backCard as HTMLDivElement).style.height = `${height}px`;
    });
  }

  /**
   * Add frontOnTop property to each card
   */
  prepareData(): void {
    this.vocabs.controls.forEach(vocab => {
      (vocab as FormGroup).addControl('frontOnTop', new FormControl(true));
    });
  }

  /**
   * Flip the card
   */
  flipCard(index): void {
    const frontOnTopCtrl = this.vocabs.at(index).get('frontOnTop');
    frontOnTopCtrl.setValue(!frontOnTopCtrl.value);
  }
}
