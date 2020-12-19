import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  IconButton,
  Chip,
  CardActions,
  Button,
  Avatar,
  makeStyles,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import TimerIcon from '@material-ui/icons/Timer';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import InfoIcon from '@material-ui/icons/Info';
import './Dashboard.css';

const useStyles = makeStyles(() => ({
  green: {
    color: '#fff',
    backgroundColor: '#00a03e',
  },
  red: {
    color: '#fff',
    backgroundColor: '#FF3B1D',
  },
}));

// functional component for individual dashboard cards
const DashCard = (quiz) => {
  const [quizDetails, setQuizDetails] = React.useState({});
  const classes = useStyles();

  // calculate total quiz time from timeLimits of each question
  const calculateTime = (questions) => {
    let t = 0;
    if (questions) {
      questions.forEach((element) => {
        t += parseInt(element.timeLimitInSecs, 10);
      });
    }
    return t;
  };

  // send callback to delete current quiz
  const handleDelete = (e) => {
    const quizID = e.currentTarget.id;
    quiz.deleteCallback(quizID);
  };

  React.useEffect(() => {
    setQuizDetails(quiz.details);
  }, [quiz]);

  return (
    <Card className="card" id={quiz.details.id}>
      <CardHeader
        title={quiz.details.name}
        avatar={(
          <Avatar aria-label="active" className={quiz.details.active ? classes.green : classes.red}>
            {quiz.details.active ? <CheckIcon /> : <CloseIcon />}
          </Avatar>
        )}
      />
      <CardMedia
        className="card-image"
        image={quiz.details.thumbnail ? quiz.details.thumbnail : '/question-image.jpg'}
        title={quiz.details.name}
      />
      <CardContent className="card-body">
        <Chip
          label={quiz.details.questions ? `${quiz.details.questions.length} questions` : '0 questions'}
          id="question-count"
          variant="outlined"
          color="primary"
          className="card-chip"
          icon={<QuestionAnswerIcon />}
        />
        <Chip
          label={`${calculateTime(quiz.details.questions)} seconds`}
          id="time-count"
          variant="outlined"
          color="primary"
          className="card-chip"
          icon={<TimerIcon />}
        />
      </CardContent>
      <CardActions>
        <IconButton aria-label="delete" id={quiz.details.id} className="card-delete" onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
        <IconButton className="card-edit" onClick={() => quiz.editCallback(quiz.details.id)}>
          <EditIcon />
        </IconButton>
        <Button id="quiz-toggle" variant="contained" onClick={() => { quiz.statusCallback(!quiz.details.active, quiz.details.id); }} className={quiz.details.active ? classes.red : classes.green}>{quiz.details.active ? 'Stop' : 'Start' }</Button>
        {
          (!!quizDetails.active
            && (
            <IconButton aria-label="info" id={quiz.details.active} className="card-info" onClick={() => { quiz.infoCallback(quizDetails.active); }}>
              <InfoIcon />
            </IconButton>
            )
          )
        }
      </CardActions>
    </Card>
  );
};

export default React.memo(DashCard);
