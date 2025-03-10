import { useEffect, useState, useRef } from "react";
import { useAtomValue } from "jotai";

import platformApi from "../services/platform-api";
import { accessTokenAtom, accessLevelAtom } from "../atoms";
import { useNavigate, useParams } from "react-router-dom";
import Message from "../components/Message";

const AttemptPage = () => {
  const accessToken = useAtomValue(accessTokenAtom);
  const accessLevel = useAtomValue(accessLevelAtom);

  const { name: eventName } = useParams();

  const navigate = useNavigate();

  const [competitionData, setCompetitionData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(null);

  const answersRef = useRef(answers);

  const questionStyle = {
    border: 0,
    margin: "20px 0 20px 0",
    backgroundColor: "rgba(138, 143, 192, 0.23)",
    padding: 20,
  };

  const questionHeaderStyle = {
    borderBottom: "2px solid rgba(53, 55, 66, 0.63)",
    margin: "5px 0 5px 0",
    paddingBottom: 10,
  };

  const radioStyle = {
    display: "inline",
    width: 13,
    height: 13,
    margin: 10,
  };

  useEffect(() => {
    answersRef.current = answers
    setErrorMessage("");
  }, [answers]);

  useEffect(() => {
    if (accessToken === null || accessLevel !== "student") {
      navigate("/");
      return;
    }
    platformApi
      .startCompetition(eventName, accessToken)
      .then((receivedCompetitionData) => {
        setCompetitionData(receivedCompetitionData);
      })
      .catch((error) => {
        console.log(error);
        navigate("/");
      });
  }, []);

  useEffect(() => {
    if (!competitionData) {
      return;
    }
    const countdownInterval = setInterval(() => {
      const currentTime = new Date().getTime();
      const endTime = new Date(competitionData.competition.endDate).getTime();
      let newTimeRemaining = endTime - currentTime;

      if (newTimeRemaining <= 0) {
        setTimeRemaining(0);
        submitAttempt();
        clearInterval(countdownInterval);
      } else {
        setTimeRemaining(newTimeRemaining);
      }
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [competitionData]);

  const submitAttempt = (event) => {
    event?.preventDefault();

    const attemptDetails = {
      competitionTitle: competitionData.competition.title,
      attempts: answersRef.current,
    };

    platformApi
      .postAttempt(attemptDetails, accessToken)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        setErrorMessage("Error - Submission could not be posted");
        console.log(error);
      });
  };

  const changeAnswer = (questionTitle, index) => {
    setAnswers({ ...answers, [questionTitle]: index });
  };

  if (!competitionData) {
    return null;
  }

  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeRemaining / (1000 * 60)) % 60);
  const seconds = Math.floor((timeRemaining / 1000) % 60);

  return (
    <div>
      <h1>{competitionData.competition.title}</h1>
      <p>Time remaining:</p>
      <p>
        {!days ? null : <span>{days} Days - </span>}
        {!days && !hours ? null : <span>{hours} Hours - </span>}
        {!days && !hours && !minutes ? null : <span>{minutes} Minutes - </span>}
        {timeRemaining === null ? (
          <span>Loading...</span>
        ) : (
          <span>{seconds} Seconds </span>
        )}
      </p>

      <form onSubmit={submitAttempt} autoComplete="off">
        {competitionData.questions.map((question, index) => (
          <fieldset key={question.title} style={questionStyle}>
            <h3 style={questionHeaderStyle}>{`Q${index + 1}`}</h3>
            <h3>{question.title}</h3>
            {question.options.map((option, index) => (
              <div key={index}>
                <input
                  type="radio"
                  style={radioStyle}
                  id={question.title + index}
                  name={question.title}
                  value={index}
                  onChange={() => changeAnswer(question.title, index)}
                />
                <label htmlFor={question.title + index}>{option}</label>
              </div>
            ))}
          </fieldset>
        ))}
        <Message message={errorMessage} type="error" />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AttemptPage;
