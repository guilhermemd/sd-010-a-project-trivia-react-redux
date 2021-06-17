import { getQuestionsFromAPI } from '../services/api';

export const REQUEST_API_GAME = 'REQUEST_API_GAME';
export const GET_QUESTIONS = 'GET_QUESTIONS';
export const SET_TIMER_ID = 'SET_TIMER_ID';
export const SAVE_SECONDS = 'SAVE_SECONDS';

// ACTIONS
export const requestApiGame = (questionsArray) => ({
  type: REQUEST_API_GAME,
  results: questionsArray,
});

export const setTimerID = (timerID) => ({
  type: SET_TIMER_ID,
  timerID,
});

export const saveSeconds = (seconds) => ({
  type: SAVE_SECONDS,
  seconds,
});

// THUNKS
export const requestQuestionThunk = () => async (dispatch) => {
  const tokenUser = localStorage.getItem('token');
  const amountOfQuestions = 5;
  const questions = await getQuestionsFromAPI(amountOfQuestions, tokenUser);
  const questionsArray = questions.results;
  dispatch(requestApiGame(questionsArray));
};

export const updateScoreThunk = (correct, qDiff) => (dispatch) => {
  console.log(correct, qDiff);
};
