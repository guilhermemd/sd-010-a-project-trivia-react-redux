import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { arrayOf, object } from 'prop-types';
import Questions from '../components/Questions';
import {
  disableAnswer as disableAnswerAction,
  verifyAnswered as verifyAnsweredAction,
} from '../actions';
import Header from '../components/Header';
import Timer from '../components/Timer';
import Loading from '../components/Loading';
import getGravatarImg from '../components/getGravatarImg';

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      questions: [],
      answers: [],
      questionIndex: 0,
    };
    this.setLoading = this.setLoading.bind(this);
    this.handleClickNext = this.handleClickNext.bind(this);
    this.setAnswers = this.setAnswers.bind(this);
    this.buildRanking = this.buildRanking.bind(this);
  }

  componentDidMount() {
    this.setLoading();
  }

  setLoading() {
    const timeOut = 3000;
    setTimeout(() => {
      const { questions } = this.props;
      if (questions.length) {
        const answers = questions.map((question) => [
          question.correct_answer,
          ...question.incorrect_answers,
        ]);
        this.setState({
          questions,
          isLoading: false,
          answers,
        });
      }
    }, timeOut);
  }

  setAnswers() {
    const { questions, questionIndex } = this.state;
    const {
      correct_answer: correctAnswer,
      incorrect_answers: incorrectAnswers,
    } = questions[questionIndex];
    this.setState({
      answers: [correctAnswer, ...incorrectAnswers],
    });
  }

  handleClickNext() {
    const { disableAnswer, verifyAnswered } = this.props;
    disableAnswer(false);
    verifyAnswered(true);
    this.setState(({ questionIndex }) => ({
      questionIndex: questionIndex + 1,
    }));
  }

  buildRanking() {
    const playerInfo = JSON.parse(localStorage.getItem('state')).player;
    console.log(playerInfo);
    let ranking = JSON.parse(localStorage.getItem('ranking'));

    if (!Array.isArray(ranking)) {
      ranking = [];
    }

    ranking.push({
      name: playerInfo.playerName,
      score: playerInfo.score,
      picture: getGravatarImg(playerInfo.gravatarEmail),
    });

    const UM = 1;
    ranking.sort((a, b) => {
      if (a.score > b.score) return -UM;
      if (a.score < b.score) return UM;
      return 0;
    });

    localStorage.setItem('ranking', JSON.stringify(ranking));
  }

  render() {
    const { isLoading, questions, answers, questionIndex } = this.state;
    const { isAnswered } = this.props;

    if (isLoading) return <Loading />;
    if (questionIndex > Number('4')) {
      this.buildRanking();
      return <Redirect to="/feedback" />;
    }
    return (
      <section>
        <Link to="/feedback">Teste</Link>
        <Header />
        <Questions
          questions={ questions }
          answers={ answers }
          questionIndex={ questionIndex }
        />
        <button
          type="button"
          data-testid="btn-next"
          onClick={ this.handleClickNext }
          hidden={ isAnswered }
        >
          Next
        </button>
        <Timer />
      </section>
    );
  }
}

const mapStateToProps = (state) => ({
  questions: state.game.questions,
  isAnswered: state.gameMatch.isAnswered,
});

const mapDispatchToProps = (dispatch) => ({
  disableAnswer: () => dispatch(disableAnswerAction()),
  verifyAnswered: (bool) => dispatch(verifyAnsweredAction(bool)),
});

Game.propTypes = {
  questions: arrayOf(object),
}.isRequired;

export default connect(mapStateToProps, mapDispatchToProps)(Game);
