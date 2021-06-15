import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Ranking extends Component {
  render() {
    const index = '';
    return (
      <div>
        <ul>
          <li />
          <li data-testid={ `player-name-${index}` } />
          <li data-testid={ `player-score-${index}` } />
        </ul>
        <Link to="/">
          <button data-testid="btn-go-home" type="button">Voltar ao início</button>
        </Link>
      </div>
    );
  }
}

export default Ranking;
