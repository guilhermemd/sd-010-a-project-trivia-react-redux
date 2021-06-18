import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Header from '../components/Header';

class FeedBack extends React.Component {
  mensageScore() {
    const { correct } = this.props;
    const SCORE_MIN = 3;

    if (correct >= SCORE_MIN) return 'Mandou bem!';
    return 'Podia ser melhor...';
  }

  /*  numberMatchers() {
    const { correct } = this.props;
    if (correct === 0) return 'Não acertou nenhuma pergunta';
    return `Acertou ${correct} perguntas`;
  } */

  render() {
    const { correct, score } = this.props;
    return (
      <div className="feedback">
        <Header />
        <p data-testid="feedback-text">{this.mensageScore()}</p>
        <p data-testid="feedback-total-question">{correct}</p>
        <p data-testid="feedback-total-score">{score}</p>
        <Link to="/">
          <button className="btn waves-effect waves-light"
            type="button"
            data-testid="btn-play-again"
          >
            Jogar novamente
          </button>
        </Link>
      </div>
    );
  }
}

FeedBack.propTypes = {
  correct: PropTypes.number.isRequired,
  score: PropTypes.number.isRequired,
};

const mapStateToProps = ({ login: { score, correct } }) => ({
  score,
  correct,
});

export default connect(mapStateToProps)(FeedBack);
