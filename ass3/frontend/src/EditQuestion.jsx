import React from 'react';
import {
  Select, TextField, MenuItem, Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import Api from './api';
import './EditQuestion.css';
import EditQuestionCard from './EditQuestionCard';

const styles = makeStyles({
  inputField: {
    margin: '3%',
  },
  formButton: {
    width: '50%',
    margin: '3%',
    'align-self': 'center',
  },
});

// functional component for edit question route
const EditQuestion = (game) => {
  const gameId = parseInt(game.match.params.id, 10);
  const questionId = parseInt(game.match.params.question, 10);
  const [questionBody, setQuestionBody] = React.useState(null);
  const [question, setQuestion] = React.useState('');
  const [questionType, setQuestionType] = React.useState('');
  const [timeLimit, setTimeLimit] = React.useState(0);
  const [points, setPoints] = React.useState(0);
  const [mediaType, setMediaType] = React.useState('none');
  const [videoUrl, setVideoUrl] = React.useState('');
  const [url, setUrl] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('');
  const [answers, setAnswers] = React.useState([]);
  const classes = styles();
  const api = new Api();
  const questionTypes = ['SC', 'MC'];
  const mediaTypes = ['none', 'video', 'image'];
  const history = useHistory();

  // formulate data and submit question edit
  const submitQuestion = (e) => {
    e.preventDefault();
    // set url to either image url or video url
    let finalUrl = '';
    if (mediaType === 'image') {
      finalUrl = imageUrl;
    } else if (mediaType === 'video') {
      finalUrl = videoUrl;
    } else {
      finalUrl = '';
    }
    const questionJSON = {
      id: questionId,
      questionType,
      question,
      timeLimitInSecs: timeLimit,
      points,
      mediaType,
      url: finalUrl,
      answers,
    };
    // update values of the selected question within the quiz object
    const x = questionBody.questions;
    questionBody.questions.forEach((item, i) => {
      if (parseInt(item.id, 10) === questionId) {
        x[i] = questionJSON;
      }
    });

    const body = questionBody;
    body.questions = x;
    api.updateQuiz(gameId, JSON.stringify(body))
      .then(() => {
        history.push(`/edit/game/${gameId}`);
      });
  };

  // get question object specified by questionID from array of questions
  const getQuestion = (questions, questionID) => {
    let currentQuestion = null;
    questions.forEach((item) => {
      if (parseInt(item.id, 10) === parseInt(questionID, 10)) {
        currentQuestion = item;
      }
    });
    return currentQuestion;
  };

  const setVideoURLS = (link) => {
    setUrl(link);
    setVideoUrl(link.replace('watch?v=', 'embed/'));
  };

  // set default filled in values for form states
  const setValues = (item) => {
    setQuestion(item.question);
    setQuestionType(item.questionType);
    setTimeLimit(item.timeLimitInSecs);
    setPoints(item.points);
    setMediaType(item.mediaType);
    if (item.mediaType === 'image') {
      setImageUrl(item.url);
    } else {
      setVideoURLS(item.url);
    }
    setAnswers(item.answers);
  };

  // handle answer callback from question answer options
  // adds answer from component into answers state
  const answersCallback = (checked, answer, id) => {
    const x = answers;
    const newAnswer = {
      option: answer,
      answer: checked,
      id,
    };
    x.forEach((item, i) => {
      if (item.id === id) {
        answers[i] = newAnswer;
      }
    });
  };

  // handle delete callback from question answer options
  const deleteCallback = (id) => {
    // delete answer of id {id} from answers state
    let newAnswers = [...answers];
    newAnswers = newAnswers.filter((answer) => answer.id !== id);
    setAnswers(newAnswers);
  };

  // handle image input
  const handleChangeImage = () => {
    const file = document.querySelector('input[type=file]').files[0];
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      setImageUrl(reader.result);
    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  // handle add of new answer option card
  const addElement = () => {
    const object = {
      id: answers.length,
      option: '',
      answer: false,
    };
    const newAnswers = [...answers];
    newAnswers.push(object);
    return newAnswers;
  };

  React.useEffect(() => {
    api.getQuiz(gameId)
      .then((result) => {
        setQuestionBody(result);
        setValues(getQuestion(result.questions, questionId));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="Main-content">
      <form className="App-form question-form" onSubmit={submitQuestion}>
        <TextField label="Question" variant="outlined" margin="normal" className="input-field" value={question} onChange={(e) => setQuestion(e.target.value)} />
        <Select
          margin="normal"
          value={questionType}
          onChange={(e) => setQuestionType(e.target.value)}
          className="input-field"
        >
          {questionTypes.map((n) => (
            <MenuItem value={n}>{n}</MenuItem>
          ))}
        </Select>
        <div className="grouped-inputs">
          <TextField label="Points" variant="outlined" margin="normal" className="input-field" type="number" value={points} onChange={(e) => setPoints(e.target.value)} />
          <TextField label="Time (s)" variant="outlined" margin="normal" className="input-field" type="number" value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)} />
        </div>

        <Select
          value={mediaType}
          onChange={(e) => setMediaType(e.target.value)}
          className="input-field"
        >
          {mediaTypes.map((n) => (
            <MenuItem value={n}>{n}</MenuItem>
          ))}
        </Select>
        { mediaType === 'video'
        && (
        <div>
          <TextField label="Link" variant="outlined" placeholder="e.g. https://www.youtube.com/watch?v=MxV1lfyG-ro" className="input-field" value={url} onChange={(e) => setVideoURLS(e.target.value)} />
          { videoUrl
          && (
            <iframe
              className="previewImg"
              height="500px"
              src={videoUrl}
              frameBorder="0"
              title="video"
            />
          )}
        </div>
        )}
        { mediaType === 'image'
        && (
        <div className="App-form">
          <Button
            variant="contained"
            component="label"
          >
            Upload File
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleChangeImage}
            />
          </Button>
          <img className="previewImg" alt={question} src={imageUrl} />
        </div>
        )}
        <div className="">
          <h2>Answers</h2>
          {
            answers.map((n) => (
              <EditQuestionCard
                editCallback={answersCallback}
                deleteCallback={deleteCallback}
                text={n.option}
                last={answers.length}
                id={n.id}
                checked={n.answer}
              />
            ))
          }
          {(answers.length < 6)
          && (
          <Button
            color="primary"
            onClick={() => setAnswers(addElement())}
          >
            Add another option
          </Button>
          )}
        </div>
        <div className="button-group">
          <Button
            variant="contained"
            color="primary"
            className={classes.formButton}
            value="Submit"
            onClick={() => history.push(`/edit/game/${gameId}`)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.formButton}
            type="submit"
            value="Submit"
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditQuestion;
