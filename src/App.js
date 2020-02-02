import React, { Component } from 'react';
import './App.css';

export default class extends Component {

  constructor() {
    super();
    this.number_of_pairs = 10;
    this.gameState = 0;
    this.firstCardIndex = null;
    this.secondCardIndex = null;
    this.disabled_cards = Array(this.number_of_pairs * 2).fill(false);

    this.cards_content = [];
    for (let i = 0; i < this.number_of_pairs; i++) {

      this.cards_content.push(i);
      this.cards_content.push(i);

    }
    this.shuffle(this.cards_content);


    this.state = {
      cards: Array(this.number_of_pairs * 2).fill(false)
    }

  }

  shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }


  render() {
    return <>
      <div className="container">
        {this.renderCards()}
      </div>
    </>
  }

  renderCards() {
    const cards = []
    for (let i = 0; i < this.state.cards.length; i++)
      cards.push(this.renderCard(i))
    return cards
  }

  renderCard(i) {
    return <div
      className={this.cardClassName(i)}
      key={Math.random()}
      onClick={() => this.advanceGame(i)}>{this.cards_content[i]}</div>
  }

  cardClassName(index) {
    if (this.isCardVisible(index))
      return 'card'
    else
      return 'card hidden'
  }

  isCardVisible(i) {
    return this.state.cards[i]
  }

  flipCard = (i) => {

    this.setState((prevState) => {
      const updatedCards = [...prevState.cards]
      updatedCards[i] = !prevState.cards[i]
      return { cards: updatedCards }
    })
  }

  advanceGame(i) {
    switch (this.gameState) {
      case 0:
        if (this.disabled_cards[i]) break;
        this.flipCard(i);
        this.setFirstCardIndex(i);
        this.incrementGameState();
        break;

      case 1:
        if (this.disabled_cards[i]) break;
        if (i === this.firstCardIndex) break;
        this.flipCard(i);
        this.setSecondCardIndex(i);
        if (this.areCardsContentsEqual(this.firstCardIndex, this.secondCardIndex)) {
          this.disableCard(this.firstCardIndex);
          this.disableCard(this.secondCardIndex);
          this.resetGameState();
          break;
        }
        else
          this.incrementGameState();
        break;

      case 2:
        this.flipTwoCards(this.firstCardIndex, this.secondCardIndex);
        this.resetGameState();
        break;
      default:
        break;
    }
  }

  flipTwoCards(firstCardIndex, secondCardIndex) {
    this.flipCard(firstCardIndex)
    this.flipCard(secondCardIndex)
  }

  disableCard(index) {
    this.disabled_cards[index] = true
  }

  resetGameState() {
    this.gameState = 0
  }

  incrementGameState() {
    this.gameState++
  }

  setFirstCardIndex(i) {
    this.firstCardIndex = i
  }

  setSecondCardIndex(i) {
    this.secondCardIndex = i
  }

  areCardsContentsEqual(firstIndex, secondIndex) {
    return this.getCardContent(firstIndex) === this.getCardContent(secondIndex)
  }

  getCardContent(i) {
    return this.cards_content[i]
  }

}
