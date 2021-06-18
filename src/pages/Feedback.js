import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

class Feedback extends Component {
  render() {
    const { score, assertions } = this.props;
    const averageAssertions = 3;
    const disappointment = 'Podia ser melhor...';
    const congratulations = 'Mandou bem!';
    return (
      <div>
        <Header />
        <section>
          <h3 data-testid="feedback-text">
            {assertions < averageAssertions ? disappointment : congratulations}
          </h3>
          <h4 data-testid="feedback-total-score">
            {score}
          </h4>
          <h4 data-testid="feedback-total-question">
            {assertions}
          </h4>
        </section>
        <button type="button" data-testid="btn-play-again">
          <Link to="/">
            Jogar novamente
          </Link>
        </button>
        <button type="button" data-testid="btn-ranking">
          <Link to="/ranking">
            Ver Ranking
          </Link>
        </button>
      </div>
    );
  }
}

const mapStateToProps = (
  { gameReducer: { score }, questionsReducer: { assertions }, player: { name } },
) => ({
  score,
  assertions,
  name,
});

Feedback.propTypes = {
  score: PropTypes.number.isRequired,
  assertions: PropTypes.number.isRequired,
};

export default connect(mapStateToProps)(Feedback);
