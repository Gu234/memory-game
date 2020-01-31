import React, { Component } from 'react';
import './App.css';

export default class extends Component {

  state = {
    cards_content: ['yellow', 'red', 'blue', 'blue', 'red'],
    number_of_cards: 10,
    cards: Array(5).fill(false),
    gameState: 0,
    firstCardIndex: null,
    secondCardIndex: null,
    comparedCardContentsAreTheSame: null
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
      onClick={() => this.advanceGame(i)}>{this.state.cards_content[i]}</div>
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
    const updatedCards = [...this.state.cards];
    updatedCards[i] = !this.state.cards[i];
    this.setState({ cards: updatedCards })
  }


  advanceGame(i) {
    const { gameState } = this.state
    switch (gameState) {
      case 0:
        this.flipCard(i);
        this.setFirstCardIndex(i);
        console.log(this.state.firstCardIndex);

        this.incrementGameState();
        break;

      case 1:
        if (i === this.state.firstCardIndex)
          break;

        this.flipCard(i);
        this.setSecondCardIndex(i);
        this.setFirstAndSecondCardsContentTheSame();

        if (this.state.comparedCardContentsAreTheSame) {
          this.resetGameState();
          break;
        }
        else
          this.incrementGameState();
        break;

      case 2:
        this.flipFirstAndSecondCards();
        this.resetGameState();
        break;
      default:
        break;
    }
  }

  flipFirstAndSecondCards() {
    this.flipCard(this.state.firstCardIndex);
    this.flipCard(this.state.secondCardIndex);
  }

  resetGameState() {
    this.setState({ gameState: 0 })
  }

  incrementGameState() {
    this.setState({ gameState: this.state.gameState + 1 });
  }

  setFirstCardIndex(i) {
    this.setState({ firstCardIndex: i })
  }

  setSecondCardIndex(i) {
    this.setState({ secondCardIndex: i })
  }

  setFirstAndSecondCardsContentTheSame() {
    if (this.getCardContent(this.state.firstCardIndex) === this.getCardContent(this.state.secondCardIndex))
      this.setState({ comparedCardContentsAreTheSame: true });
    else
      this.setState({ comparedCardContentsAreTheSame: false });
  }

  getCardContent(i) {

    return this.state.cards_content[i]
  }

}
