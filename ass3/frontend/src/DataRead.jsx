import React from 'react';
import {
  Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import Api from './api';

const { Validator } = require('jsonschema');

const DataRead = (details) => {
  const [uploadOpen, setUploadOpen] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const api = new Api();

  // handle open of upload dialog
  const handleOpen = () => {
    setUploadOpen(true);
  };

  // handle close of upload dialog
  const handleClose = () => {
    setUploadOpen(false);
    setSelectedFile('');
    setErrorMessage('');
  };

  // store selected file on file upload
  const onFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // validates json object to match required format
  const validateJSON = (json) => {
    const v = new Validator();

    // schema format for answers
    const answerSchema = {
      id: '/SimpleAnswer',
      type: 'array',
      items: {
        properties: {
          id: { type: 'integer' },
          option: { type: 'string' },
          answer: { type: 'boolean' },
        },
        required: ['id', 'option', 'answer'],
      },
      minItems: 1,
    };

    // schema format for questions
    const questionSchema = {
      id: '/SimpleQuestion',
      type: 'array',
      items: {
        properties: {
          id: { type: 'integer' },
          questionType: { type: 'string' },
          question: { type: 'string' },
          timeLimitInSecs: { type: 'integer' },
          points: { type: 'integer' },
          mediaType: { type: 'string' },
          url: { type: 'string' },
          answers: { $ref: '/SimpleAnswer' },
        },
        required: ['id', 'questionType', 'question', 'timeLimitInSecs', 'points', 'mediaType', 'answers'],
      },
    };

    // schema format for json object
    const schema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        thumbnail: { type: 'string' },
        questions: { $ref: '/SimpleQuestion' },
      },
      required: ['name', 'questions'],
    };
    v.addSchema(questionSchema, '/SimpleQuestion');
    v.addSchema(answerSchema, '/SimpleAnswer');
    const ref = v.validate(json, schema, { required: true });
    return ref;
  };

  // make requests to create a quiz from the given json
  const createQuizFromJSON = (json) => {
    let quizID = 0;
    const validation = validateJSON(json);
    if (validation.valid) {
      const body = JSON.stringify({
        name: json.name,
      });
      api.createQuiz(body)
        .then(() => {
          api.getAdminQuizzes()
            .then((result) => {
              // search results to find quizID of newly created quiz on name
              result.quizzes.forEach((element) => {
                if (element.name === json.name) {
                  quizID = element.id;
                  const updateBody = JSON.stringify({
                    questions: json.questions,
                    name: json.name,
                    thumbnail: json.thumbnail,
                  });
                  api.updateQuiz(element.id, updateBody)
                    .then(() => {
                      details.dataCallback(quizID);
                    });
                }
              });
            });
        });
      handleClose();
      details.dataCallback(quizID);
    } else {
      setErrorMessage(`Invalid JSON. Error: '${validation.errors[0].stack}'. See game_data.json for sample format.`);
    }
  };

  // handle file upload
  const FileUpload = () => {
    const reader = new FileReader();

    reader.addEventListener('load', (e) => {
      const files = (e.target.result, JSON.parse(reader.result));
      createQuizFromJSON(files);
    });

    reader.readAsText(selectedFile);
  };

  return (
    <div>
      <Dialog open={uploadOpen} onClose={handleClose}>
        {
          (errorMessage !== ''
            && <Alert severity="error" onClose={() => setErrorMessage('')}>{errorMessage}</Alert>
          )
        }
        <DialogTitle>Create new quiz</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Upload a JSON file to create a quiz
          </DialogContentText>
          <input type="file" accept=".json" onChange={onFileChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={FileUpload}>
            Upload quiz file
          </Button>
        </DialogActions>
      </Dialog>
      <Button variant="contained" color="primary" onClick={handleOpen}>Upload JSON</Button>
    </div>

  );
};

export default DataRead;
