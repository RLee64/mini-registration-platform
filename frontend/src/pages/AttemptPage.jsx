import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";

import platformApi from "../services/platform-api";
import { accessTokenAtom } from "../atoms";
import { useNavigate } from "react-router-dom";

const AttemptPage = () => {
  const accessToken = useAtomValue(accessTokenAtom);

  const searchParams = new URLSearchParams(window.location.search);
  const eventName = searchParams.get("name");

  const navigate = useNavigate();

  const [competitionData, setCompetitionData] = useState(null);
  const [answers, setAnswers] = useState({});

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
    if (accessToken === null) {
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
        if (error.status === 404 || error.status === 401) {
          navigate("/");
        }
      });
  }, []);

  const changeAnswer = (questionTitle, index) => {
    setAnswers({ ...answers, [questionTitle]: index });
  };

  const submitAttempt = (event) => {
    event.preventDefault();

    const attemptDetails = {
      competitionTitle: competitionData.competitionTitle,
      attempts: answers,
    };

    platformApi
      .postAttempt(attemptDetails, accessToken)
      .then((returnedAttempt) => {
        console.log(returnedAttempt)
        console.log("success")
      }

      )
      .catch((error) => {
        console.log(error);
      });
  };

  if (!competitionData) {
    return null;
  }

  return (
    <div>
      <h1>{competitionData.competitionTitle}</h1>
      <form onSubmit={submitAttempt}>
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
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AttemptPage;
