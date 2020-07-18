import { NewVocabPage } from './new-vocab.po';
import { browser, by } from 'protractor';

describe('New Vocab Page e2e test', () => {
  let page: NewVocabPage;

  beforeEach(() => {
    page = new NewVocabPage();
    page.navigateTo();
  });

  /**
   * New button related test
   */
  it('should add a new index card on new button clicked', () => {
    const indexCards = page.getIndexCards();
    expect(indexCards.count()).toBe(1);
    const newBtn = page.getNewBtn();
    newBtn.click();
    expect(indexCards.count()).toBe(2);
  });

  it('should remove an index card on remove button clicked', () => {
    const indexCards = page.getIndexCards();
    const newBtn = page.getNewBtn();
    newBtn.click();
    expect(indexCards.count()).toBe(2);
    const removeBtn = page.getFirstRemoveBtn();
    removeBtn.click();
    expect(indexCards.count()).toBe(1);
  });
});
