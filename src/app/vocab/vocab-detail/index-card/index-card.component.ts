import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

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
}
