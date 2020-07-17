import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-index-card',
  templateUrl: './index-card.component.html',
  styleUrls: ['./index-card.component.scss']
})
export class IndexCardComponent implements OnInit {
  @Input() mode = '';
  @Input() vocabs = this.fb.array([]); // FormArray of vocabs

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.prepareData();
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
