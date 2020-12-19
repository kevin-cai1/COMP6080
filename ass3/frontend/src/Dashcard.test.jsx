import { shallow } from 'enzyme';
import React from 'react';
import {
  CardHeader, CardMedia,
} from '@material-ui/core';
import DashCard from './DashCard';

const quiz = {
  active: null,
  createdAt: '2020-11-12T03:28:01.988Z',
  id: 400513819,
  name: 'Quiz 1',
  oldSessions: [124195, 133624, 147122],
  owner: 'kevin@unsw.edu.au',
  thumbnail: 'placeholder url',
  questions: [
    {
      question: 'Test question',
      timeLimitInSecs: '10',
    },
    {
      question: 'Test question 2',
      timeLimitInSecs: '15',
    },
  ],
};

describe('dashcard', () => {
  it('has a game title', () => {
    const card = shallow(<DashCard details={quiz} />);
    expect(card.find(CardHeader).prop('title')).toBe(quiz.name);
  });

  it('has number of questions', () => {
    const card = shallow(<DashCard details={quiz} />);
    expect(card.find('#question-count').prop('label')).toBe('2 questions');
  });

  it('has total time to complete', () => {
    const card = shallow(<DashCard details={quiz} />);
    expect(card.find('#time-count').prop('label')).toBe('25 seconds');
  });

  it('has a thumbnail', () => {
    const card = shallow(<DashCard details={quiz} />);
    expect(card.find(CardMedia).prop('image')).toBe(quiz.thumbnail);
  });

  it('has clickable element to edit quiz details', () => {
    const editItem = jest.fn();
    const card = shallow(<DashCard details={quiz} editCallback={editItem} />);
    card.find('.card-edit').simulate('click');
    expect(editItem).toBeCalledTimes(1);
    expect(editItem).toHaveBeenCalledWith(quiz.id);
  });

  it('has clickable element to delete quiz', () => {
    const deleteItem = jest.fn();
    const card = shallow(<DashCard details={quiz} deleteCallback={deleteItem} />);
    card.find('.card-delete').simulate('click', { currentTarget: { id: quiz.id } });
    expect(deleteItem).toBeCalledTimes(1);
    expect(deleteItem).toHaveBeenCalledWith(quiz.id);
  });

  it('has clickable element to start quiz', () => {
    const startQuiz = jest.fn();
    const card = shallow(<DashCard details={quiz} statusCallback={startQuiz} />);
    card.find('#quiz-toggle').simulate('click');
    expect(startQuiz).toBeCalledTimes(1);
    expect(startQuiz).toHaveBeenCalledWith(true, quiz.id);
  });

  it('has clickable element to stop quiz', () => {
    const stopQuiz = jest.fn();
    const newQuiz = quiz;
    newQuiz.active = 190439;
    const card = shallow(<DashCard details={newQuiz} statusCallback={stopQuiz} />);
    card.update();
    card.find('#quiz-toggle').simulate('click'); // to stop quiz
    expect(stopQuiz).toBeCalledTimes(1);
    expect(stopQuiz).toHaveBeenCalledWith(false, quiz.id);
  });
});
