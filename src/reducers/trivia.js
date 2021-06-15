import { TOKEN } from '../actions';

const INITIAL_STATE = {
  token: '',
};

const trivia = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case TOKEN:
    localStorage.setItem('token', action.payload);
    return { ...state, token: action.payload };
  default:
    return state;
  }
};

export default trivia;
