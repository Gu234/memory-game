import React, { Component } from 'react';
import './App.css';

function shuffle(array) {
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

export default class extends Component {
  constructor() {
    super();
    const numberOfPairs = 10;
    const disabledCards = Array(numberOfPairs * 2).fill(false);
    const cardsContent = Array(numberOfPairs * 2).fill().map((_, i) => Math.floor(i / 2))
    shuffle(cardsContent);

    this.state = {
      gameState: 0,
      firstCardIndex: null,
      secondCardIndex: null,
      cards: Array(numberOfPairs * 2).fill(false),
      disabledCards,
      cardsContent
    }

  }

  render() {
    return <>
      <div className="container">
        {this.renderCards()}
      </div>
    </>
  }

  renderCards() {
    return this.state.cards.map(this.renderCard)
  }

  renderCard = (isVisible, i) => {
    return <div
      className={this.cardClassName(isVisible, i)}
      key={Math.random()}
      onClick={() => this.advanceGame(i)}>{this.getCardContent(i)}</div>
  }

  cardClassName(isVisible, i) {
    const classes = ['card']
    const { firstCardIndex, secondCardIndex, disabledCards } = this.state

    if (!isVisible)
      classes.push('hidden')

    if (!this.areCardsContentsEqual(firstCardIndex, secondCardIndex) && this.state.gameState === 2 && (i === firstCardIndex || i === secondCardIndex))
      classes.push('invalid')

    if (disabledCards[i])
      classes.push('matched')

    return classes.join(' ')
  }

  flipCard = (i) => {
    this.setState((prevState) => {
      const updatedCards = [...prevState.cards]
      updatedCards[i] = !prevState.cards[i]
      return { cards: updatedCards }
    })
  }

  advanceGame(i) {

    switch (this.state.gameState) {
      case 0:
        this.runGameFirstStep(i)
        break;

      case 1:
        this.runGameSecondStep(i)
        break;

      case 2:
        this.runGameThirdStep()
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
    this.setState(({ disabledCards }) => {
      const cards = [...disabledCards]
      cards[index] = true
      return { disabledCards: cards }
    })
  }

  resetGameState() {
    this.setState({ gameState: 0, firstCardIndex: null, secondCardIndex: null })

  }

  incrementGameState() {
    this.setState(({ gameState }) => ({ gameState: gameState + 1 }))
  }

  setFirstCardIndex(i) {
    this.setState({ firstCardIndex: i })
  }

  setSecondCardIndex(i) {
    this.setState({ secondCardIndex: i })
  }

  areCardsContentsEqual(firstCardIndex, secondCardIndex) {
    return this.getCardContent(firstCardIndex) === this.getCardContent(secondCardIndex)
  }

  getCardContent(i) {

    return this.state.cardsContent[i]
  }

  runGameFirstStep(i) {
    if (this.isCardDisabled(i)) return
    this.flipCard(i)
    this.setFirstCardIndex(i)
    this.incrementGameState()
  }

  runGameSecondStep(i) {

    if (this.isCardDisabled(i)) return
    if (i === this.state.firstCardIndex) return

    this.setSecondCardIndex(i);
    this.flipCard(i);

    const { firstCardIndex } = this.state
    if (this.areCardsContentsEqual(firstCardIndex, i)) {

      this.disableCard(firstCardIndex);
      this.disableCard(i);
      this.resetGameState();
    }
    else
      this.incrementGameState();

  }

  runGameThirdStep() {
    const { firstCardIndex, secondCardIndex } = this.state
    this.flipTwoCards(firstCardIndex, secondCardIndex);
    this.resetGameState();
  }

  isCardDisabled(i) {
    return this.state.disabledCards[i]
  }

}
