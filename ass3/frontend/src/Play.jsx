import React from 'react';
import {
  Fade, Card, CardHeader, CardContent, Grid, Button, CardMedia, Chip, Paper,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import TimerIcon from '@material-ui/icons/Timer';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import { makeStyles } from '@material-ui/core/styles';
import Api from './api';

const styles = makeStyles(() => ({
  option: {
    width: '100%',
    'text-transform': 'capitalize',
    height: '120%',
  },
  answerBox: {
    'padding-top': '32px',
    // 'background-color': '#d2b1b74f',
  },
  title: {
    'box-shadow': '0px 3px 12px 7px #b5a8b1',
  },
  cardMedia: {
    display: 'flex',
    'justify-content': 'center',
    height: '200px',
    margin: '3% 0',
  },
  timerRow: {
    'text-align': 'center',
    'margin-top': '3%',
    'padding-bottom': 0,
  },
  timerChip: {
    'font-weight': 700,
    'font-size': '110%',
    margin: '0 20px 1% 20px',
  },
  resultsBox: {
    'background-color': '#d2b1b74f',
    padding: '3%',
    'border-radius': '10px',
  },
  tick: {
    color: 'green',
    margin: '5% 2% 0 0',
    'font-size': '1.7rem',

  },
  cross: {
    color: 'red',
    margin: '5% 2% 0 0',
    'font-size': '1.7rem',
  },
  newGameButton: {
    'margin-top': '30px',
  },
}));

// functional component for the Play quiz screen
const Play = () => {
  const playerName = localStorage.getItem('playerName');
  const api = new Api();
  const [gameStatus, setGameStatus] = React.useState('waiting');
  const [questionDetails, setQuestionDetails] = React.useState({
    id: -1,
    question: '',
    answers: [],
  });
  const [results, setResults] = React.useState([]);
  const [timeLeft, setTimeLeft] = React.useState(0);
  const [fade, setFade] = React.useState(false);
  const [optionSelected, setOptionSelected] = React.useState([]);
  const classes = styles();
  const history = useHistory();

  // gets time difference between current time and quiz starting time
  // returns time difference
  // startTime - quiz starting time
  const timeDifference = (startTime) => {
    const currTime = new Date();
    const isoTimeMillis = Date.parse(startTime);
    return parseInt((currTime - isoTimeMillis) / 1000, 10);
  };

  // handles selection of question option
  // submits new answers to submitAnswer Api
  // targetId - target id of option selected
  const handleOptionSelected = (targetId) => {
    if (timeLeft > 0) {
      const newSelectedOptions = [...optionSelected];
      const newAnswerIds = [];
      newSelectedOptions[targetId] = !optionSelected[targetId];
      if (questionDetails.questionType === 'SC') {
        optionSelected.map((option, idx) => {
          if (idx !== targetId) {
            newSelectedOptions[idx] = false;
          }
          return '';
        });
        if (newSelectedOptions[targetId]) {
          newAnswerIds.push(targetId);
        }
      } else {
        newSelectedOptions.map((option, idx) => {
          if (option === true) {
            newAnswerIds.push(idx);
          }
          return '';
        });
      }
      setOptionSelected(newSelectedOptions);
      api.submitAnswers(JSON.stringify({ answerIds: newAnswerIds }));
    }
  };

  // gets answers if question time limit is up
  React.useEffect(() => {
    if (timeLeft === 0 && (gameStatus === 'question')) {
      setGameStatus('answer');
      setOptionSelected([...optionSelected.fill(false)]);
      api.getAnswers()
        .then((result) => {
          if (result.answerIds) {
            const newQuestionDetails = { ...questionDetails };
            questionDetails.answers.map((answer, idx) => {
              if (typeof result.answerIds.find((correct) => correct === answer.id) !== 'undefined') {
                newQuestionDetails.answers[idx].answer = true;
              } else {
                newQuestionDetails.answers[idx].answer = false;
              }
              return '';
            });
            setQuestionDetails(newQuestionDetails);
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  // gets status of the game, checks if game has started
  // setsGameStatus if game has started
  React.useEffect(() => {
    let interval = 0;
    if (gameStatus === 'waiting') {
      interval = setInterval(() => {
        api.getGameStatus()
          .then((result) => {
            if (result.started) {
              setGameStatus('question');
            }
          });
      }, 1000);
    }
    return () => clearInterval(interval);
  });

  // gets current quiz questions
  // sets quizDetails
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (gameStatus === 'question' || (gameStatus === 'answer')) {
        api.getQuestion()
          .then((result) => {
            if (result.error) {
              setGameStatus('result');
              api.getPlayerResults()
                .then((playerResults) => {
                  setResults(playerResults);
                });
            } else {
              if (questionDetails.id !== result.question.id) {
                setGameStatus('question');
                setQuestionDetails(result.question);
                const options = new Array(result.question.answers.length);
                setOptionSelected(options.fill(false));
              }
              const secs = result.question.timeLimitInSecs
                - timeDifference(result.question.isoTimeLastQuestionStarted);
              setTimeLeft((secs > 0) ? secs : 0);
            }
          });
      }
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionDetails, gameStatus]);

  // sets the fading of the waiting text
  React.useEffect(() => {
    const interval = setInterval(() => {
      setFade(!fade);
    }, 2000);
    return () => clearInterval(interval);
  });

  return (
    <div>
      {(gameStatus === 'waiting')
      && (
        <div className="question-loading">
          <Fade in={fade} timeout={1000}>
            <h1 className="loading-text">Waiting for game to start...</h1>
          </Fade>
        </div>
      )}
      {(gameStatus === 'question' || gameStatus === 'answer') && (questionDetails.id !== -1)
      && (
        <div className="Main-content">
          <Grid item md={9} xs={12}>
            <Card>
              <CardHeader
                title={`Q${parseInt(questionDetails.id, 10) + 1}: ${questionDetails.question}`}
                className={classes.title}
              />
              <CardContent className={classes.timerRow}>
                <Chip
                  label={timeLeft}
                  variant="outlined"
                  color="primary"
                  className={classes.timerChip}
                  icon={<TimerIcon />}
                />
              </CardContent>
              <CardMedia className={classes.cardMedia}>
                {(questionDetails.mediaType === 'video')
                && (
                  <iframe
                    title="video"
                    height="200"
                    src={questionDetails.url}
                  />
                )}
                {(questionDetails.mediaType === 'image')
                && (
                  <img className="q-card-image" alt="question" src={questionDetails.url} />
                )}
                {(questionDetails.mediaType === 'none')
                && (
                  <img className="q-card-image-default" alt="default-no-media" src="/question-image.jpg" />
                )}
              </CardMedia>
              <CardContent className={classes.answerBox}>
                {(gameStatus === 'answer') && <p className="option-heading">Correct Answers</p>}
                {(gameStatus === 'question') && (
                  <p className="option-heading">
                    {(questionDetails.questionType === 'SC') ? 'single ' : 'multiple '}
                    choice question
                  </p>
                )}
                <Grid container spacing={2}>
                  { questionDetails.answers.map((answer) => (
                    <Grid key={answer.id} item xs={12} sm={6}>
                      {(gameStatus === 'question') && (
                        <Button
                          id={answer.id}
                          variant={(optionSelected[answer.id]) ? 'contained' : 'outlined'}
                          color="primary"
                          size="large"
                          className={classes.option}
                          onClick={() => handleOptionSelected(answer.id)}
                        >
                          {answer.option}
                        </Button>
                      )}
                      {(gameStatus === 'answer') && (
                        <Button
                          id={answer.id}
                          variant="outlined"
                          color="primary"
                          size="large"
                          className={classes.option}
                          endIcon={(answer.answer) ? <CheckIcon /> : <ClearIcon />}
                        >
                          {answer.option}
                        </Button>
                      )}
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </div>
      )}
      {(gameStatus === 'result')
      && (
        <div className="game-results">
          <h1 className="results-heading">{`Here's how you did, ${playerName}:`}</h1>
          <Grid
            container
            spacing={2}
            xs={12}
            sm={9}
            md={7}
            lg={5}
            className={classes.resultsBox}
          >
            {
              results.map((result, idx) => (
                <>
                  <Grid item xs={6} lg={6}>
                    <h2 className="question-heading">{`Question ${parseInt(idx + 1, 10)}`}</h2>
                  </Grid>
                  <Grid item xs={6} lg={6}>
                    <Paper elevation={1} className={classes.answerPaper}>
                      {(result.correct)
                        ? (
                          <div className="result-card">
                            <CheckIcon className={classes.tick} />
                            <p className="result-subtext">Correct</p>
                          </div>
                        )
                        : (
                          <div className="result-card">
                            <ClearIcon className={classes.cross} />
                            <p className="result-subtext">Incorrect</p>
                          </div>
                        )}
                    </Paper>
                  </Grid>
                </>
              ))
            }
          </Grid>
          <Button
            startIcon={<SportsEsportsIcon />}
            variant="contained"
            color="primary"
            className={classes.newGameButton}
            onClick={() => history.push('/join')}
          >
            New Game
          </Button>
        </div>
      )}
    </div>
  );
};

export default Play;
