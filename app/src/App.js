import React, {Component} from 'react';
import Modal from './Modal';
import api from './api';
import './App.css';
import SubmitScore from './SubmitScore';
import Leaderboard from './Leaderboard';

const rows = [
  [ 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', ],
  [ 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l' ],
  [ 'z', 'x', 'c', 'v', 'b', 'n', 'm' ]
]

const LOOP_EVERY = 500;

class App extends Component{
  constructor(props) {
    super(props);
    this.state = {
      activeKey: '',
      stack: [],
      activeWord: '',
      multiplier: 1,
      correctTillNow: '',
      score: 0,
      time: 0,
      user: {},
      modalOpen: false,
      showLeader: true,
      leaderBoard: []
    }
    this.onKeyPress = this.onKeyPress.bind(this);
    this.gameLoop = this.gameLoop.bind(this);
    this.startGame= this.startGame.bind(this);
  }

  async componentDidMount() {
    await this.updateLeaderboard();
  }

  async updateLeaderboard() {
    const {status, data} = await api.get('/score/top');
    if (status === 200)
      this.setState({
        leaderBoard: data
      })
    else
      throw new Error('Error fetching score list.');
    
  }

  async resetStatus() {
    const token = localStorage.getItem('token');
    const { status, data } = await api.post('/start', {
      token 
    })
    if (status === 200) {
      this.words = data.words;
      this.setState({
        user: data.user,
        score: 0
      })
    }
  }

  async startGame() {
    await this.resetStatus();
    this.gameInterval = setInterval(() => this.gameLoop(), LOOP_EVERY);
    this.setState({
      showLeader: false
    })
    this.nextWord()
    this.appRef.focus();
  }

  endGame() {
    clearInterval(this.gameInterval);
    this.setState({
      user: {
        ...this.state.user,
        score: this.state.score,
      },
      activeWord: '',
      modalOpen: true,
      showLeader: true
    });

  }

  nextWord() {
    if (this.words.length === 0) {
      this.endGame();
      return;
    }

    this.setState({
      activeWord: this.words.pop(),
      input: '',
      time: 0
    })
  }
  
  gameLoop() {
    const { time } = this.state;
    this.setState({
      activeKey: '',
      time: time + LOOP_EVERY
    });
  }

  onKeyPress(e) {
    const key = e.key;
    if (key.match(/[a-z]/i)) {
      const { input, activeWord } = this.state;
      const newInput = (input + key).toLowerCase();
      if (activeWord.indexOf(newInput) === 0) {
        // correct start up till now
        if (activeWord === newInput){
          // correct completely
          const { time, score, multiplier } = this.state;
          const wordScore = Math.ceil((1/time * 10000)) * multiplier;
          this.setState({
            activeKey: key.toLowerCase(),
            input: '',
            score: score + wordScore,
            multiplier: multiplier + 1
          }, () => {
            this.nextWord();
          });
        }
        this.setState({
          activeKey: key.toLowerCase(),
          input: newInput
        });
      } else {
        // mistype
        this.setState({
          activeKey: key.toLowerCase(),
          input: '',
          multiplier: 1
        })
      } 
    }
  }

  closeModal() {
    this.setState({
      modalOpen: false
    })
  }

  render() {
    const { 
      activeKey,
      activeWord,
      input,
      multiplier,
      score,
      modalOpen,
      showLeader,
      leaderBoard
    } = this.state;

    const keyboard = rows.map( (row, index) => {
      const keys = row.map(key => (
        <div 
          className={`key ${activeKey === key ? 'active' : ''}`} 
          key={key}
        >
          {key}
        </div>
      ));
      return (<div className="key-row" key={index}>{ keys }</div>)
    } );

    return (
      <div className="App" onKeyDown={this.onKeyPress} tabIndex="0" ref={el => this.appRef = el}>
        <h1>Word Race</h1>
        <div className="info-panel centre-flex">
          <div id="score">Score <span id="score-num">{ score }</span></div>
          <div id="multiplier"><span className="x">x</span>{ multiplier }</div>
        </div>
        <div className="screen centre-flex" style={{marginBottom: showLeader ? 0 : 20}}>
          {!activeWord ?
            <button onClick={ this.startGame }>Start</button>
          :
          <h1>
            <span className="highlight">{ input }</span>
            <span>{ activeWord.replace(new RegExp(input), '') }</span>
          </h1>}
        </div>
        { showLeader && <Leaderboard scores={ leaderBoard }/>}
        { keyboard }
        <Modal className="Modal" isOpen={ modalOpen } >
          <div className="modal-content">
            <SubmitScore 
              {...this.state.user}
              onSuccess={ (user) => { this.setState({ user, modalOpen: false }); this.updateLeaderboard() } }
            />
          </div>
        </Modal>
      </div>
    );
  }
}

export default App;
