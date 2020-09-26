import { Quote, QuoteService } from './../quote.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-loading-dialog',
  templateUrl: './loading-dialog.component.html',
  styleUrls: ['./loading-dialog.component.scss']
})
export class LoadingDialogComponent implements OnInit {

  selectedQuote: Quote;
  constructor(private quoteService: QuoteService,
              @Inject(MAT_DIALOG_DATA) public title) { }

  ngOnInit(): void {
    this.selectedQuote = this.quoteService.getQuote();
  }

}
