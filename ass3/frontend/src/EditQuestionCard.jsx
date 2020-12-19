import React from 'react';
import {
  Checkbox, TextField, IconButton,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

// functional component for toggleable answer inputs
const EditQuestionCard = (option) => {
  const [checked, setChecked] = React.useState(option.checked);
  const [answer, setAnswer] = React.useState(option.answer);
  const lastOption = parseInt(option.last, 10) - 1;

  // set default states of fields
  React.useEffect(() => {
    setChecked(option.checked);
    setAnswer(option.text);
  }, [option]);

  React.useEffect(() => {
    option.editCallback(checked, answer, option.id);
  }, [checked, answer, option]);

  return (
    <div className="answer-field">
      <Checkbox
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        inputProps={{ 'aria-label': 'primary checkbox' }}
      />
      <TextField
        className="options-field"
        autoFocus
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />
      {((option.id === lastOption) && (lastOption > 1)) && (
        <IconButton aria-label="delete" id={option.id} className="option-delete" onClick={() => { option.deleteCallback(option.id); }}>
          <CloseIcon />
        </IconButton>
      )}
    </div>
  );
};

export default EditQuestionCard;
