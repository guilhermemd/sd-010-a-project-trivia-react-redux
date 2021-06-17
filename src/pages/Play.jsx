import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchQuestion, updateScore } from '../redux/actions';
import Header from '../components/Header';

class Play extends Component {
  constructor(props) {
    super(props);
    this.state = {
      answersOfRound: [],
      questionNumber: 0,
      questionOfRound: [],
      time: 30,
      answered: false,
      isLoading: true,
    };

    this.mountRound = this.mountRound.bind(this);
    this.countdown = this.countdown.bind(this);
    this.calcScore = this.calcScore.bind(this);
    this.changeColor = this.changeColor.bind(this);
    this.createOptions = this.createOptions.bind(this);
    this.changeStyle = this.changeStyle.bind(this);
  }

  async componentDidMount() {
    const { callApiToQuestions, questions, token } = this.props;
    if (questions.length === 0) await callApiToQuestions(token);
    this.mountRound();
    this.countdown();
  }

  calcScore() {
    const { time, questionNumber } = this.state;
    const { questions, assertations, score, callUpdateScore } = this.props;
    const difficultyOfQuestion = questions[questionNumber].difficulty;
    const weigth = { easy: 1, medium: 2, hard: 3 };
    const baseScoreAssertation = 10;
    const roundScore = baseScoreAssertation + time * weigth[difficultyOfQuestion];
    const newScore = { assertations: assertations + 1, score: score + roundScore };
    callUpdateScore(newScore);
  }

  createOptions() {
    const { questions } = this.props;
    const { questionNumber } = this.state;
    const {
      incorrect_answers: incorrectAnswers,
      correct_answer: correctAnswer,
    } = questions[questionNumber];
    const { answered } = this.state;
    let options = incorrectAnswers.map((answer, index) => (
      <label htmlFor={ index } key={ index }>
        <input
          id={ index }
          className="wrong-answer"
          type="button"
          name="answer"
          disabled={ answered }
          value={ answer }
          onClick={ this.changeColor }
          style={ { border: answered ? '3px solid rgb(255, 0, 0)' : '' } }
          data-testid={ `wrong-answer-${index}` }
        />
      </label>
    ));

    options.push(
      <label htmlFor="correct-answer" key="correct-answer">
        <input
          data-testid="correct-answer"
          id="correct-answer"
          type="button"
          name="answer"
          className="correct-answer"
          value={ correctAnswer }
          disabled={ answered }
          onClick={ this.changeColor }
          style={ { border: answered ? '3px solid rgb(6, 240, 15)' : '' } }
        />
      </label>,
    );
    const probToChange = 0.5;
    options = options.sort(() => Math.random() - probToChange);
    return options;
  }

  mountRound() {
    const { questions } = this.props;
    const { questionNumber } = this.state;
    const {
      category,
      question,
    } = questions[questionNumber];
    const questionOfRound = (
      <aside key="question_field">
        <h3 key="category" data-testid="question-category">{`Categoria: ${category}`}</h3>
        <h3 key="question" data-testid="question-text">{question}</h3>
      </aside>
    );

    this.setState({
      answersOfRound: this.createOptions(),
      questionOfRound,
      isLoading: false,
    });
  }

  changeColor({ target = { className: '' } }) {
    this.setState({
      answered: true,
    }, () => this.mountRound());
    if (target.className === 'correct-answer') this.calcScore();
  }

  finishGame() {
    // desenvolver logica para chamar a tela de feedback
  }

  nextQuestion() {
    const { questions } = this.props;
    const { questionNumber } = this.state;
    if (questionNumber + 1 < questions.length) {
      this.setState((previusState) => ({
        questionNumber: previusState.questionNumber + 1,
        answered: false,
        time: 30,
      }), () => {
        this.mountRound();
        this.countdown();
      });
    } else {
      this.finishGame();
    }
  }

  countdown() {
    const second = 1000;
    const minTime = 0;
    const counter = setInterval(() => {
      this.setState((previusState) => {
        if (previusState.time === minTime || previusState.answered) {
          this.changeColor({});
          clearInterval(counter);
        } else {
          return ({ time: previusState.time - 1 });
        }
      });
    }, second);
  }

  changeStyle() {
    const { answersOfRound } = this.state;
    answersOfRound[0].style.borderColor = '3px solid rgb(6, 240, 15)';
    this.setState({ answersOfRound });
  }

  render() {
    const { questionOfRound, isLoading, time, answersOfRound } = this.state;
    return (
      <main>
        <Header />
        {questionOfRound}
        <aside>
          {isLoading ? <div>Carregando...</div> : answersOfRound}
        </aside>

        <button
          type="button"
          onClick={ () => this.nextQuestion() }
          data-testid="btn-next"
        >
          Próxima
        </button>
        <button type="button" onClick={ this.changeStyle }>teste</button>
        <span>{time}</span>
      </main>
    );
  }
}

Play.propTypes = {
  callApiToQuestions: PropTypes.func,
  token: PropTypes.string,
  questions: PropTypes.arrayOf(PropTypes.object),
  score: PropTypes.number,
  assertation: PropTypes.number,
  callUpdateScore: PropTypes.func,
}.isRequired;

const mapStateToProps = (state) => ({
  questions: state.player.questions,
  token: state.player.token,
  score: state.player.score,
  assertations: state.player.assertations,
});

const mapDispatchToProps = (dispatch) => ({
  callApiToQuestions: (token) => dispatch(fetchQuestion(token)),
  callUpdateScore: (newScore) => dispatch(updateScore(newScore)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Play);
