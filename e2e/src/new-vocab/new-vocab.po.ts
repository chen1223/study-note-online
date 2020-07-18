import { browser, element, by } from 'protractor';

export class NewVocabPage {
  navigateTo() {
    return browser.get('/vocab/new');
  }

  /**
   * New button
   */
  getNewBtn() {
    return element(by.css('.new-btn'));
  }

  /**
   * Get all index cards
   */
  getIndexCards() {
    return element.all(by.css('.card'));
  }

  getFirstRemoveBtn() {
    return element(by.css('.remove-btn'));
  }
}
