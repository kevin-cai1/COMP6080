import { Checkbox, TextField, Button } from '@material-ui/core';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ClearIcon from '@material-ui/icons/Clear';

const styles = makeStyles(() => ({
  checkbox: {
    padding: '18px 11px 0 5px',
  },
}));

// functional component to render a question option
// option.optionsCallback - parent callback to pass options text and checked state
const Option = (option) => {
  const [checked, setChecked] = React.useState(false);
  const [optionText, setOptionText] = React.useState('');
  const lastOption = parseInt(option.last, 10) - 1;
  const classes = styles();

  // handles when a checkbox is ticked
  const handleChecked = (e) => {
    setChecked(e.target.checked);
    option.optionsCallback(option.index, optionText, e.target.checked);
  };

  // handles when the option text is changed
  const handleOptionText = (e) => {
    setOptionText(e.target.value);
    option.optionsCallback(option.index, e.target.value, checked);
  };

  // handles when an option is deleted
  const handleDeleteOption = () => {
    option.deleteOptionsCallback(option.index);
  };

  return (
    <div className="new-q-option">
      <Checkbox
        checked={checked}
        onChange={handleChecked}
        inputProps={{ 'aria-label': 'primary checkbox' }}
        className={classes.checkbox}
      />
      <TextField
        autoFocus
        label={`Option ${option.index + 1}`}
        type="text"
        value={optionText}
        placeholder={`Option ${option.index + 1}`}
        onChange={handleOptionText}
        size="small"
      />
      {((option.index === lastOption) && (lastOption > 1)) && (
        <Button onClick={handleDeleteOption}>
          <ClearIcon />
        </Button>
      )}
    </div>
  );
};

export default Option;
