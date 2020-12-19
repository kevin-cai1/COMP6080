import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
} from '@material-ui/core';
import Api from './api';
import './Dashboard.css';

// functional component for Admin Results route
const AdminResults = (params) => {
  const [sessionID] = React.useState(params.match.params.id);
  const [quizDetails, setQuizDetails] = React.useState({});
  const [results, setResults] = React.useState([]);
  const [topResults, setTopResults] = React.useState([]);
  const [barData, setBarData] = React.useState({});
  const [lineData, setLineData] = React.useState({});
  const api = new Api();

  // gets time difference between UTC end time and start time
  const getResponseTime = (startTime, endTime) => {
    const d1 = new Date(startTime);
    const d2 = new Date(endTime);
    const diff = d2 - d1;
    const diffSeconds = diff / 1000;
    return Math.round((diffSeconds + Number.EPSILON) * 100) / 100;
  };

  const averageTime = (totalTime, numUsers) => totalTime / numUsers;

  const correctPercent = (totalCorrect, numUsers) => (totalCorrect / numUsers) * 100;

  // generate an array of strings for y axis labels for graphs
  const generateGraphLabels = (vals) => {
    const array = [];
    for (let i = 0; i < vals.length; i += 1) {
      array.push(`Q${i + 1}`);
    }
    return array;
  };

  // generate data object for a bar chart
  const generateBarChartData = (responses, label) => {
    const info = {
      labels: generateGraphLabels(responses),
      datasets: [
        {
          label,
          data: responses,
          borderWidth: 1,
          borderColor: '#800a39',
          backgroundColor: '#800a39',
        },
      ],
    };
    return info;
  };

  // generate data object for a line chart
  const generateLineChartData = (responses, label) => {
    const data = {
      labels: generateGraphLabels(responses),
      datasets: [
        {
          label,
          fill: false,
          backgroundColor: '#800a39',
          borderColor: '#800a39',
          pointBorderColor: '#800a39',
          pointBackgroundColor: '#fff',
          data: responses,
        },
      ],
    };
    return data;
  };

  // return top 5 users and scores for given responses
  const generateTopResults = (responses, users) => {
    const items = Object.keys(responses).map((key) => [key, responses[key]]);
    items.sort((first, second) => second[1] - first[1]);

    const topValues = items.slice(0, 5);
    const topUsers = topValues.map((x) => {
      const info = {
        user: users[x[0]],
        score: x[1],
      };
      return info;
    });
    return topUsers;
  };

  // analyse results based on given results for a quiz
  const analyseResults = (res, quiz) => {
    if (res.length !== 0) {
      const averageTimes = [];
      const answerPercentages = [];
      const userPerformances = {};
      for (let i = 0; i < res[0].answers.length; i += 1) { // iterate through questions
        let totalTime = 0;
        let numUsers = 0;
        let totalCorrect = 0;
        res.forEach((users, idx) => { // iterate through users
          const currentQuestion = users.answers[i];
          const responseTime = getResponseTime(
            currentQuestion.questionStartedAt, currentQuestion.answeredAt,
          );
          if (currentQuestion.correct) {
            userPerformances[idx] = (userPerformances[idx] || 0) + quiz.questions[i].points;
          }
          totalCorrect += currentQuestion.correct ? 1 : 0;
          totalTime += responseTime;
          numUsers += 1;
        });
        averageTimes.push(averageTime(totalTime, numUsers));
        answerPercentages.push(correctPercent(totalCorrect, numUsers));
      }
      setBarData(generateBarChartData(answerPercentages, 'Percentage of correct responses'));
      setLineData(generateLineChartData(averageTimes, 'Average response times'));
      setTopResults(generateTopResults(userPerformances, res));
    }
  };

  // options for charts
  const options = {
    maintainAspectRatio: true,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  React.useEffect(() => {
    api.getQuizResults(sessionID)
      .then((res) => {
        setResults(res.results);
        api.getQuiz(params.match.params.quizID)
          .then((quiz) => {
            setQuizDetails(quiz);
            analyseResults(res.results, quiz);
          });
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h1>
        {`Admin Results - ${quizDetails.name}`}
      </h1>
      { results.length === 0
      && (
        <h2>No results</h2>
      )}
      {results.length > 0
      && (
        <div className="graph-container">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Position</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Score</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topResults.map((row, index) => (
                  <TableRow key={row.user.name}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.user.name}</TableCell>
                    <TableCell>{row.score}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Bar className="contents" data={barData} style={{ width: '100%', height: '100%' }} options={options} />
          <Line className="contents" data={lineData} style={{ width: '100%', height: '100%' }} />
        </div>
      )}

    </div>
  );
};

export default AdminResults;
