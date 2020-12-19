import React from 'react';
import {
  Card, CardHeader, CardContent, CardMedia, IconButton, Chip, Paper, CardActions,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import TimerIcon from '@material-ui/icons/Timer';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import StarIcon from '@material-ui/icons/Star';
import './Dashboard.css';
import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles(() => ({
  tick: {
    color: '#317e31',
  },
  cross: {
    color: '#c43636',
  },
  answerPaper: {
    margin: '2%',
    padding: '2%',
    display: 'flex',
    'flex-direction': 'row',
  },
  cardMedia: {
    display: 'flex',
    'justify-content': 'center',
    height: '200px',
  },
}));

// functional component to render a question's details
// question.parentCallback - parentCallback that passes the target id of question to be deleted
const QuestionCard = (question) => {
  const questionDetails = question.info;
  const history = useHistory();
  const classes = styles();

  // handles deleting a question
  const handleDelete = (e) => {
    const questionId = e.currentTarget.id;
    question.parentCallback(questionId);
  };

  return (
    <Card className="card" id={questionDetails.id}>
      <CardHeader
        title={`${questionDetails.id + 1}. ${questionDetails.question}`}
      />
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
          <img className="q-card-image-default" alt="none" src="/question-image.jpg" />
        )}
      </CardMedia>
      <CardContent>
        <Chip
          label={questionDetails.questionType === 'SC' ? 'Single choice question' : 'Multiple choice question'}
          variant="outlined"
          color="primary"
          className="card-chip"
          icon={<QuestionAnswerIcon />}
        />
        <Chip
          label={`${questionDetails.timeLimitInSecs} seconds`}
          variant="outlined"
          color="primary"
          className="card-chip"
          icon={<TimerIcon />}
        />
        <Chip
          label={`${questionDetails.points} points`}
          variant="outlined"
          color="primary"
          className="card-chip"
          icon={<StarIcon />}
        />
      </CardContent>
      <CardContent className="card-answer-container">
        <h5 className="card-answers-label">Answers</h5>
        { questionDetails.answers.map((answer) => (
          <Paper elevation={1} className={classes.answerPaper}>
            { (answer.answer)
              ? <CheckIcon className={classes.tick} />
              : <ClearIcon className={classes.cross} /> }
            <p className="q-card-answer-option">{answer.option}</p>
          </Paper>
        ))}
      </CardContent>
      <CardActions>
        <IconButton aria-label="delete" id={questionDetails.id} className="card-delete" onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
        <IconButton onClick={() => history.push(`/edit/game/${question.gameId}/${questionDetails.id}`)}>
          <EditIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default QuestionCard;
