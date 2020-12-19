import React from 'react';
import {
  Button, Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle, TextField, FormControl, InputLabel, Select, MenuItem, Box,
} from '@material-ui/core';
import './Dashboard.css';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import Api from './api';
import Option from './Option';
import QuestionCard from './QuestionCard';

const styles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
  numberInput: {
    margin: '18px 10px 0 0',
  },
  addOptionTitle: {
    'margin-top': '3%',
    'font-weight': '600',
  },
}));

// functional component for editing a quiz/game
const EditGame = (game) => {
  const gameId = game.match.params.id;
  const [name, setName] = React.useState('');
  const [quizThumbnail, setQuizThumbnail] = React.useState('');
  const [quizDetails, setQuizDetails] = React.useState({ questions: [] });
  const [questionType, setQuestionType] = React.useState('');
  const [questionText, setQuestionText] = React.useState('');
  const [timeLimit, setTimeLimit] = React.useState('');
  const [pointsAllocated, setPointsAllocated] = React.useState('');
  const [mediaType, setMediaType] = React.useState('none');
  const [videoLink, setVideoLink] = React.useState('');
  const [imageLink, setImageLink] = React.useState('');
  const [answerIndex, setAnswerIndex] = React.useState(2);
  const [answers, setAnswers] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const api = new Api();
  const classes = styles();

  // handles opening the new question modal
  // sets open state to true
  const handleOpen = () => {
    setOpen(true);
  };

  // handles closing the new question modal
  // sets open state to false
  // clears new question input fields
  const handleClose = () => {
    setOpen(false);
    setQuestionType('');
    setQuestionText('');
    setTimeLimit('');
    setPointsAllocated('');
    setMediaType('none');
    setVideoLink('');
    setImageLink('');
    setAnswerIndex(2);
    setAnswers([]);
  };

  // handles opening the edit quiz modal
  // sets edit open state to true
  const handleEditOpen = () => {
    setEditOpen(true);
  };

  // handles opening the edit quiz modal
  // sets edit open state to false
  const handleEditClose = () => {
    setEditOpen(false);
  };

  // taken from helper.js in COMP6080 Ass2
  // method to convert image file to data url promise
  // file - file object
  const fileToDataUrl = (file) => {
    const reader = new FileReader();
    const dataUrlPromise = new Promise((resolve, reject) => {
      reader.onerror = reject;
      reader.onload = () => resolve(reader.result);
    });
    reader.readAsDataURL(file);
    return dataUrlPromise;
  };

  // method to get dataUrl of image and set the image link state
  // e - img event
  const handleImage = (e) => {
    const file = e.target.files[0];
    fileToDataUrl(file)
      .then((result) => {
        setImageLink(result);
      });
  };

  // method to get the dataUrl of thumbnail image and set the quiz thumbnail state
  // e - img event
  const handleQuizThumbnail = (e) => {
    const file = e.target.files[0];
    fileToDataUrl(file)
      .then((result) => {
        setQuizThumbnail(result);
      });
  };

  // method to handle deleting a question
  // updates the quiz detail state and calls the update quiz Api
  // questionId - target questionId to be deleted
  const deletedCallback = (questionId) => {
    const id = parseInt(questionId, 10);
    const newQuizDetails = { ...quizDetails };
    const newQuestions = [];
    newQuizDetails.questions.map((question) => (
      (question.id !== id) && newQuestions.push(question)
    ));
    newQuizDetails.questions = newQuestions;
    setQuizDetails(newQuizDetails);
    api.updateQuiz(gameId, JSON.stringify(newQuizDetails))
      .then((r) => r);
    handleClose();
  };

  // method to handle changes in option component
  // sets answers to reflect changes
  // index - int value of the target answer changed
  // answerText - string in the options text
  // checked - boolean value denoting whether checkbox is checked
  const optionsCallback = (index, answerText, checked) => {
    let newAnswers = [...answers];
    newAnswers = newAnswers.filter((answer) => answer.id !== index);
    const newOption = {
      id: index,
      option: answerText,
      answer: checked,
    };
    newAnswers.push(newOption);
    newAnswers.sort((a, b) => a.id - b.id);
    setAnswers(newAnswers);
  };

  // method to handle deleting the last option
  // sets answers to exclude last index
  const deleteOptionsCallback = () => {
    let newAnswers = [...answers];
    newAnswers = newAnswers.filter((answer) => answer.id !== answerIndex - 1);
    setAnswerIndex(answerIndex - 1);
    setAnswers(newAnswers);
  };

  // method to handle updating quiz details
  // calls the updateQuiz api
  const handleUpdate = () => {
    const newQuizDetails = {
      questions: quizDetails.questions,
      name,
      thumbnail: quizThumbnail,
    };

    api.updateQuiz(gameId, JSON.stringify(newQuizDetails))
      .then(() => {
        const newQ = { ...quizDetails };
        newQ.name = name;
        setQuizDetails(newQ);
      });
    handleEditClose();
  };

  // method to handle adding a new question
  // updates questions to the updateQuiz Api
  const handleAdd = () => {
    const newQuizDetails = {
      questions: quizDetails.questions,
      name: quizDetails.name,
      thumbnail: quizDetails.thumbnail,
    };

    let url = '';
    if (mediaType === 'video') {
      url = videoLink;
      url = url.replace(/\/watch\?v=/, /\/embed\//);
    }
    if (mediaType === 'image') {
      url = imageLink;
    }

    const newQuestion = {
      id: quizDetails.questions.length,
      questionType,
      question: questionText,
      timeLimitInSecs: timeLimit,
      points: pointsAllocated,
      mediaType,
      url,
      answers,
    };
    newQuizDetails.questions.push(newQuestion);
    api.updateQuiz(gameId, JSON.stringify(newQuizDetails));
    handleClose();
  };

  // method to get quiz details and set their states
  React.useEffect(() => {
    api.getQuiz(gameId)
      .then((result) => {
        setQuizDetails(result);
        setName(result.name);
        setQuizThumbnail(result.thumbnail);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h1>{quizDetails.name}</h1>
      <div className="button-group">
        <Button variant="contained" color="primary" onClick={handleOpen} startIcon={<AddIcon />}>
          New question
        </Button>
        <Button variant="contained" color="primary" onClick={handleEditOpen} startIcon={<EditIcon />}>
          Edit Quiz Details
        </Button>
      </div>
      <Dialog open={editOpen} onClose={handleEditClose}>
        <DialogTitle>Edit Quiz Details</DialogTitle>
        <DialogContent>
          <FormControl className={classes.formControl}>
            <TextField
              autoFocus
              label="Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              size="small"
            />
            <div>
              <Button
                variant="contained"
                component="label"
              >
                Upload Thumbnail
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleQuizThumbnail}
                />
              </Button>
              {quizThumbnail
              && (
                <img className="thumbnail-preview" alt={name} src={quizThumbnail} />
              )}
            </div>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>
            Cancel
          </Button>
          <Button onClick={handleUpdate}>
            Update Quiz
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create new question</DialogTitle>
        <DialogContent>
          <FormControl className={classes.formControl}>
            <InputLabel>Question Type</InputLabel>
            <Select
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
              label="Question Type"
            >
              <MenuItem value="MC">Multiple Choice</MenuItem>
              <MenuItem value="SC">Single Choice</MenuItem>
            </Select>
          </FormControl>
          <TextField
            autoFocus
            label="Question"
            type="text"
            value={questionText}
            placeholder="Enter a question"
            onChange={(e) => setQuestionText(e.target.value)}
            fullWidth
            size="small"
          />
          <TextField
            autoFocus
            label="Time limit (secs)"
            type="number"
            value={timeLimit}
            onChange={(e) => setTimeLimit(e.target.value)}
            variant="outlined"
            size="small"
            className={classes.numberInput}
          />
          <TextField
            autoFocus
            label="Points allocated"
            type="number"
            value={pointsAllocated}
            onChange={(e) => setPointsAllocated(e.target.value)}
            variant="outlined"
            size="small"
            className={classes.numberInput}
          />
          <FormControl className={classes.formControl}>
            <InputLabel>Add Media</InputLabel>
            <Select
              value={mediaType}
              onChange={(e) => setMediaType(e.target.value)}
              label="Question Type"
              size="small"
            >
              <MenuItem value="none">
                <em>None</em>
              </MenuItem>
              <MenuItem value="video">Video Link</MenuItem>
              <MenuItem value="image">Image</MenuItem>
            </Select>
          </FormControl>
          { (mediaType === 'video')
          && (
            <TextField
              autoFocus
              label="Video link"
              type="text"
              value={videoLink}
              placeholder="e.g. https://www.youtube.com/watch?v=MxV1lfyG-ro"
              onChange={(e) => setVideoLink(e.target.value)}
              fullWidth
              size="small"
            />
          )}
          { (mediaType === 'image')
            && (
            <div>
              <InputLabel htmlFor="questionImage">Select image</InputLabel>
              <input type="file" id="questionImage" name="questionImage" accept=".png,.jpeg,.jpg" onChange={handleImage} />
            </div>
            )}
          <DialogContentText className={classes.addOptionTitle}>
            Add your answer options (tick the correct answers)
          </DialogContentText>
          {
            [...Array(answerIndex).keys()].map((i) => (
              <Option
                index={i}
                last={answerIndex}
                optionsCallback={optionsCallback}
                deleteOptionsCallback={deleteOptionsCallback}
              />
            ))
          }
          {(answerIndex < 6)
          && (
          <Button color="primary" variant="outlined" size="small" startIcon={<AddIcon />} onClick={() => setAnswerIndex(answerIndex + 1)}>
            Add option
          </Button>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleAdd}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
      <Box display="flex" flexDirection="row" flexWrap="wrap">
        {
          quizDetails.questions.map((question) => (
            <QuestionCard gameId={gameId} info={question} parentCallback={deletedCallback} />
          ))
        }
      </Box>
    </div>
  );
};

export default EditGame;
