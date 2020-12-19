import React, { useCallback } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Box,
  IconButton,
} from '@material-ui/core';
import LinkIcon from '@material-ui/icons/Link';
import { Alert } from '@material-ui/lab';
import { useHistory } from 'react-router-dom';
import DashCard from './DashCard';
import DataRead from './DataRead';
import './Dashboard.css';
import Api from './api';

// functional component for main admin dashboard
const Dashboard = () => {
  const [quizzes, setQuizzes] = React.useState([]);
  const [quiz, setQuiz] = React.useState('');
  const [addQuizOpen, setAddQuizOpen] = React.useState(false);
  const [gameStartOpen, setGameStartOpen] = React.useState(false);
  const [gameEndOpen, setGameEndOpen] = React.useState(false);
  const [focusedSession, setFocusedSession] = React.useState('');
  const [selectedQuiz, setSelectedQuiz] = React.useState(0);
  const [name, setName] = React.useState('');
  const [copyAlertOpen, setCopyAlertOpen] = React.useState(false);
  const api = new Api();
  const history = useHistory();

  // handle open of create quiz dialog
  const handleOpen = () => {
    setAddQuizOpen(true);
  };

  // handle close of create quiz dialog
  const handleClose = () => {
    setAddQuizOpen(false);
  };

  // handle starting of game
  // opens game info dialog
  const handleGameStart = (quizID) => {
    setGameStartOpen(true);
    setSelectedQuiz(quizID);
    // start game
    api.startQuiz(quizID)
      .then(() => {
        api.getQuiz(quizID)
          .then((result) => {
            setFocusedSession(result.active);
          });
      });
  };

  // handle closing of game info dialog
  const handleGameStartClose = () => {
    setGameStartOpen(false);
  };

  // handle ending of game
  // opens game results dialog
  const handleGameEnd = (quizID) => {
    setGameEndOpen(true);
    setSelectedQuiz(quizID);
    // end game in API
    api.endQuiz(quizID);
    setQuiz(quizID);
  };

  // handle closing of game results dialog
  const handleGameEndClose = () => {
    setGameEndOpen(false);
  };

  // handle edit callback for dashcards
  const handleEdit = (quizID) => {
    history.push(`/edit/game/${quizID}`);
  };

  // handle delete callback for dashcards
  const deleteFunction = (deletedID) => {
    let newQuizzes = [...quizzes];
    newQuizzes = newQuizzes.filter((q) => q.id !== parseInt(deletedID, 10));
    setQuizzes(newQuizzes);
    api.deleteQuiz(deletedID);
  };

  // handle info callback for dashcards
  const infoCallback = (id) => {
    setGameStartOpen(true);
    setFocusedSession(id);
  };

  // handle new quiz callback for upload by json
  const handleNewAdd = (q) => {
    setQuiz(q);
  };

  // handle game status callback for dashcards
  const setGameStatusCallback = (status, id) => {
    // game status should be set to the value of status
    if (status) {
      handleGameStart(id);
    } else {
      handleGameEnd(id);
    }
  };

  // copy text to clipboard
  const handleCopyOpen = () => {
    navigator.clipboard.writeText(`${window.location.origin.toString()}/join/${focusedSession}`);
    setCopyAlertOpen(true);
  };

  // create quiz api request
  const createQuiz = () => {
    const body = JSON.stringify({
      name,
    });
    api.createQuiz(body)
      .then(() => {
        handleClose();
        setQuiz(name);
      });
  };

  // append questions to the results record from /admin/quiz
  const formulateQuizRecord = (q) => {
    const newQuiz = q;
    return api.getQuiz(q.id)
      .then((result) => {
        newQuiz.questions = result.questions;
        return newQuiz;
      });
  };

  // fetch quizzes from /admin/quiz
  const loadQuizzes = useCallback(() => {
    api.getAdminQuizzes()
      .then((result) => {
        const q = result.quizzes;
        Promise.all(q.map((r) => formulateQuizRecord(r)))
          .then(() => setQuizzes(q));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizzes]);

  React.useEffect(() => {
    loadQuizzes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz, focusedSession]);

  return (
    <div>
      <div className="dashboard-heading">
        <div className="heading">
          <h1>Dashboard</h1>
        </div>
        <div className="button-group">
          <div className="dashboard-button">
            <Button name="create-quiz" variant="contained" color="primary" onClick={handleOpen}>
              Create new quiz
            </Button>
          </div>
          <DataRead className="dashboard-button" dataCallback={handleNewAdd} />
        </div>
      </div>
      <Dialog id="started-dialog" open={gameStartOpen} onClose={handleGameStartClose}>
        {
          (copyAlertOpen
            && <Alert severity="info" onClose={() => setCopyAlertOpen(false)}>Copied to clipboard!</Alert>
          )
        }
        <DialogTitle>Game Started</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Game has started with session code [
            {focusedSession}
            ]
          </DialogContentText>
          <IconButton label="Copy join link" onClick={handleCopyOpen}>
            <LinkIcon />
          </IconButton>
          <Button onClick={() => { api.advanceQuiz(selectedQuiz); }}>
            Advance quiz
          </Button>
        </DialogContent>
      </Dialog>
      <Dialog open={gameEndOpen} onClose={handleGameEndClose}>
        <DialogTitle>Game Finished</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Would you like to view the results?
          </DialogContentText>
          <Button onClick={handleGameEndClose}>
            No
          </Button>
          <Button name="view-results" onClick={() => history.push(`/game/${selectedQuiz}/${focusedSession}/results`)}>
            Yes
          </Button>
        </DialogContent>
      </Dialog>
      <Dialog open={addQuizOpen} onClose={handleClose}>
        <DialogTitle>Create new quiz</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter a name for your new quiz
          </DialogContentText>
          <TextField
            autoFocus
            label="Name"
            name="quiz-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            Cancel
          </Button>
          <Button name="submit-quiz" onClick={createQuiz}>
            Create quiz
          </Button>
        </DialogActions>
      </Dialog>
      <Box display="flex" flexDirection="row" flexWrap="wrap">
        {quizzes.map((item, index) => (
          <DashCard
            key={item.id}
            index={index}
            deleteCallback={deleteFunction}
            statusCallback={setGameStatusCallback}
            infoCallback={infoCallback}
            editCallback={handleEdit}
            details={item}
          />
        ))}
      </Box>
    </div>
  );
};

export default Dashboard;
