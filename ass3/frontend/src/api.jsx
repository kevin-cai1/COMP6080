import Config from './config.json';

export default class Api {
  /* url - backend url and port
    playerId - optional player id
    options - fetch options
   */
  constructor() {
    this.url = `${Config.URL}:${Config.BACKEND_PORT}`;
    this.playerId = '';
    this.options = {
      method: '',
      headers: {
        Accept: 'application/json',
        Authorization: '',
        'Content-Type': 'application/json',
      },
    };
  }

  // sets the Api options method
  setMethod(method) {
    this.options.method = method;
  }

  // sets the Api options body
  setBody(body) {
    this.options.body = body;
  }

  // sets the Api auth token
  setAuth() {
    this.options.headers.Authorization = `Bearer ${localStorage.getItem('token').toString()}`;
  }

  // sets the playerId
  setPlayerId() {
    this.playerId = localStorage.getItem('playerId');
  }

  // fetches the api result
  // returns json response
  getApiResult(path) {
    return fetch(`${this.url}${path}`, this.options)
      .then((result) => result.json());
  }

  // method for login post
  login(body) {
    this.setMethod('POST');
    this.setBody(body);
    return this.getApiResult(Config.LOGIN_API);
  }

  // method for register post
  register(body) {
    this.setMethod('POST');
    this.setBody(body);
    return this.getApiResult(Config.REGISTER_API);
  }

  // method for logging out
  logout() {
    this.setMethod('POST');
    this.setAuth();
    return this.getApiResult(Config.LOGOUT_API);
  }

  // method for getting admin quizzes
  getAdminQuizzes() {
    this.setMethod('GET');
    this.setAuth();
    delete this.options.body;
    return this.getApiResult(Config.QUIZ_API);
  }

  // method for getting quiz details
  getQuiz(id) {
    this.setMethod('GET');
    this.setAuth();
    return this.getApiResult(`${Config.QUIZ_API}/${id}`);
  }

  // method for deleting quiz
  deleteQuiz(id) {
    this.setMethod('DELETE');
    this.setAuth();
    return this.getApiResult(`${Config.QUIZ_API}/${id}`);
  }

  // method for create quiz post
  createQuiz(body) {
    this.setMethod('POST');
    this.setBody(body);
    this.setAuth();
    return this.getApiResult(`${Config.QUIZ_API}/new`);
  }

  // method for updating quiz data
  updateQuiz(id, body) {
    this.setMethod('PUT');
    this.setBody(body);
    this.setAuth();
    return this.getApiResult(`${Config.QUIZ_API}/${id}`);
  }

  // method for starting quiz session
  startQuiz(id) {
    this.setMethod('POST');
    this.setAuth();
    return this.getApiResult(`${Config.QUIZ_API}/${id}/start`);
  }

  // method for ending quiz session
  endQuiz(id) {
    this.setMethod('POST');
    this.setAuth();
    return this.getApiResult(`${Config.QUIZ_API}/${id}/end`);
  }

  // method for advancing quiz question
  advanceQuiz(id) {
    this.setMethod('POST');
    this.setAuth();
    return this.getApiResult(`${Config.QUIZ_API}/${id}/advance`);
  }

  // method for getting quiz status
  getQuizStatus(id) {
    this.setMethod('GET');
    this.setAuth();
    return this.getApiResult(`${Config.SESSION_API}/${id}/status`);
  }

  // method for getting admin quiz results
  getQuizResults(id) {
    this.setMethod('GET');
    this.setAuth();
    return this.getApiResult(`${Config.SESSION_API}/${id}/results`);
  }

  // method for joining game
  joinGame(sessionId, body) {
    this.setMethod('POST');
    this.setBody(body);
    return this.getApiResult(`${Config.PLAY_API}/join/${sessionId}`);
  }

  // method for getting game status
  getGameStatus() {
    this.setMethod('GET');
    this.setPlayerId();
    return this.getApiResult(`${Config.PLAY_API}/${this.playerId}/status`);
  }

  // method for getting current game question
  getQuestion() {
    this.setMethod('GET');
    this.setPlayerId();
    return this.getApiResult(`${Config.PLAY_API}/${this.playerId}/question`);
  }

  // method for getting game answer
  getAnswers() {
    this.setMethod('GET');
    this.setPlayerId();
    return this.getApiResult(`${Config.PLAY_API}/${this.playerId}/answer`);
  }

  // method for submitting answer
  submitAnswers(body) {
    this.setMethod('PUT');
    this.setPlayerId();
    this.setBody(body);
    return this.getApiResult(`${Config.PLAY_API}/${this.playerId}/answer`);
  }

  // method for getting player results
  getPlayerResults() {
    this.setMethod('GET');
    this.setPlayerId();
    return this.getApiResult(`${Config.PLAY_API}/${this.playerId}/results`);
  }
}
