import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { loginAction } from '../Redux/actions';

const API = 'https://opentdb.com/api_token.php?command=request';

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      email: '',
      name: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange({ target: { name, value } }) {
    this.setState({ [name]: value });
  }

  async fetchApi() {
    const response = await fetch(API);
    const data = await response.json();
    return data;
  }

  async saveLocalStorage() {
    const { token } = await this.fetchApi();
    localStorage.setItem('token', token);
  }

  handleClick() {
    const { login } = this.props;
    this.saveLocalStorage();
    login(this.state);
  }

  render() {
    const { name, email } = this.state;
    return (
      <div>
        <form>
          <label htmlFor="name">
            Nome:
            <input
              type="text"
              name="name"
              id="name"
              data-testid="input-player-name"
              onChange={ this.handleChange }
              value={ name }
            />
          </label>
          <label htmlFor="Email">
            Email:
            <input
              type="email"
              name="email"
              id="email"
              data-testid="input-gravatar-email"
              onChange={ this.handleChange }
              value={ email }
            />
          </label>
          <Link to="/game">
            <button
              type="button"
              data-testid="btn-play"
              disabled={ !(email && name) }
              onClick={ this.handleClick }
            >
              Jogar
            </button>
          </Link>
        </form>
        <Link to="/settings">
          <button
            type="button"
            data-testid="btn-settings"
          >
            Settings
          </button>
        </Link>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  login: (state) => (dispatch(loginAction(state))),
});

Login.propTypes = {
  login: PropTypes.func,
}.isRequired;

export default connect(null, mapDispatchToProps)(Login);
