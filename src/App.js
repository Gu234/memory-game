import React, { Component } from 'react';
import './App.scss';
import 'csshake'

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

function getRandomSubset(arr, n) {
  var result = new Array(n),
    len = arr.length,
    taken = new Array(len);
  if (n > len)
    throw new RangeError("getRandomSubset: more elements taken than available");
  while (n--) {
    var x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

export default class extends Component {
  constructor() {
    super();

    const icons = ['amazonwebservices', 'android', 'angularjs', 'apache', 'appcelerator', 'apple', 'atom', 'babel', 'backbonejs', 'behance', 'bitbucket', 'bower', 'c', 'cakephp', 'ceylon', 'chrome', 'clojure', 'clojurescript', 'coffeescript', 'confluence', 'couchdb', 'cplusplus', 'csharp', 'css3', 'd3js', 'debian', 'devicon', 'django', 'docker', 'doctrine', 'dot-net', 'drupal', 'electron', 'elm', 'erlang', 'express', 'facebook', 'firefox', 'foundation', 'gimp', 'git', 'github', 'gitlab', 'go', 'google', 'grunt', 'handlebars', 'heroku', 'html5', 'ie10', 'inkscape', 'intellij', 'ionic', 'java', 'javascript', 'jeet', 'jetbrains', 'jquery', 'krakenjs', 'linkedin', 'linux', 'meteor', 'mongodb', 'moodle', 'mysql', 'nginx', 'nodejs', 'nodewebkit', 'oracle', 'php', 'phpstorm', 'postgresql', 'pycharm', 'python', 'react', 'redhat', 'redis', 'redux', 'ruby', 'rubymine', 'safari', 'sass', 'sequelize', 'sketch', 'slack', 'sourcetree', 'ssh', 'stylus', 'swift', 'symfony', 'tomcat', 'twitter', 'typescript', 'vagrant', 'vim', 'vuejs', 'webpack', 'webstorm', 'windows8', 'wordpress', 'yarn', 'yii', 'yunohost']

    const numberOfPairs = 2,
      disabledCards = Array(numberOfPairs * 2).fill(false)
    let cardsContent = getRandomSubset(icons, numberOfPairs)

    cardsContent = cardsContent.concat(cardsContent)
    shuffle(cardsContent);

    this.state = {
      stepCounter: 0,
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
        {this.renderGame()}
      </div>
    </>
  }

  renderGame() {
    if (this.gameEnded())
      return this.renderEndScreen()
    else
      return this.renderCards()
  }

  gameEnded() {
    return this.state.disabledCards.reduce((acc, next) => acc && next)
  }

  renderEndScreen() {
    return <div>
      <div>
        {this.state.stepCounter}

      </div>
      <div>
        <button>play again</button>
      </div>
    </div>
  }

  renderCards() {
    return this.state.cards.map(this.renderCard)
  }

  renderCard = (isVisible, i) => {

    return <div
      className={this.cardClassName(isVisible, i)}
      key={i}
      onClick={() => this.advanceGame(i)}>
      <div className='flip-card-inner'>
        <div className="flip-card-front">

        </div>
        <div className="flip-card-back">
          <img src={require(`./assets/${this.getCardContent(i)}-original.svg`)} alt="Icon" style={{ width: '100px', height: '100px' }} />
        </div>
      </div>
    </div>
  }

  cardClassName(isVisible, i) {
    const classes = ['flip-card']
    const { firstCardIndex, secondCardIndex, disabledCards } = this.state

    if (isVisible)
      classes.push('flip-card-visible')

    if (!this.areCardsContentsEqual(firstCardIndex, secondCardIndex) && this.state.gameState === 2 && (i === firstCardIndex || i === secondCardIndex))
      classes.push('invalid shake-constant shake-short')

    if (disabledCards[i])
      classes.push('matched')

    return classes.join(' ')
  }

  incrementStepCounter() {
    this.setState({
      stepCounter: this.state.stepCounter + 1
    })
  }

  flipCard(i) {
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

    this.incrementStepCounter();
    this.flipCard(i)
    this.setFirstCardIndex(i)
    this.incrementGameState()
  }

  runGameSecondStep(i) {

    if (this.isCardDisabled(i)) return
    if (i === this.state.firstCardIndex) return

    this.incrementStepCounter();
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