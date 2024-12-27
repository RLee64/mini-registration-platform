import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import Collapsible from "react-collapsible";
import { accessTokenAtom } from "../atoms";

import Message from "./Message";
import platformApi from "../services/platform-api";

const Competition = ({ competition, questions, setQuestions }) => {
  // Questions currently require 4 options, but can changed easily by adjusting the backend and changing the below value
  const optionNo = 4;

  const accessToken = useAtomValue(accessTokenAtom);

  const [newQuestionTitle, setNewQuestionTitle] = useState("");
  const [newQuestionOptions, setNewQuestionOptions] = useState(
    new Array(optionNo).fill("")
  );
  const [newQuestionCorrectIndex, setNewQuestionCorrectIndex] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const triggerStyle = {
    fontSize: 16,
    backgroundColor: "rgba(148, 146, 196, 0.2)",
    padding: 8,
    borderBottom: "2px solid rgba(98, 92, 129, 0.51)",
    marginBottom: 12,
  };

  const flexBoxWrapper = {
    display: "flex",
    flexDirection: "row",
    gap: 80,
    padding: "0 10px",
  };

  const flexComponent = {
    padding: "4px 8px 0 8px",
    width: "45%",
    marginBottom: 20,
  };

  const optionStyle = {
    display: "flex",
    gap: 15,
    marginBottom: -8,
  };

  const optionRadioStyle = {
    width: 25,
    height: 25,
  };

  const questionTitleStyle = {
    margin: "30px 0 5px 0",
    paddingBottom: 5,
    borderBottom: "3px solid rgb(61, 60, 83)",
  };

  // Wipes error message when user starts re-entering information
  useEffect(() => {
    setErrorMessage(null);
  }, [newQuestionTitle, newQuestionOptions, newQuestionCorrectIndex]);

  const clearQuestionFields = () => {
    setNewQuestionTitle("");
    setNewQuestionOptions(new Array(optionNo).fill(""));
    setNewQuestionCorrectIndex(null);
  };

  const createQuestion = (event) => {
    event.preventDefault();

    if (
      !newQuestionTitle ||
      newQuestionOptions.some((option) => option === "" || option === null)
    ) {
      setErrorMessage("Please fill in all boxes");
      return;
    }
    if (questions.find((question) => question.title === newQuestionTitle)) {
      setErrorMessage("A question with this title already exists");
      return;
    }
    if (newQuestionCorrectIndex === null) {
      setErrorMessage("A correct option must be provided");
    }

    const newQuestion = {
      title: newQuestionTitle,
      options: newQuestionOptions,
      correctIndexChoice: newQuestionCorrectIndex,
    };

    platformApi
      .postQuestion(newQuestion, competition.title, accessToken)
      .then((returnedQuestion) => {
        setQuestions(questions.concat(returnedQuestion));
        clearQuestionFields();
        setSuccessMessage("Question Added!");
        setTimeout(() => {
          setSuccessMessage(null);
        }, "3000");
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage("Error - Question could not be created");
      });
  };

  return (
    <li className="item">
      <h3>{competition.title}</h3>
      <p>Total question count: {competition.questionIds.length}</p>
      <Collapsible
        trigger="Questions"
        triggerStyle={triggerStyle}
        transitionTime={200}
      >
        <div style={flexBoxWrapper}>
          <form
            onSubmit={createQuestion}
            style={flexComponent}
            autoComplete="off"
          >
            <h3>Create New Quesiton</h3>
            <label htmlFor="questionTitle">Title</label>
            <input
              id="questionTitle"
              value={newQuestionTitle}
              onChange={(event) => setNewQuestionTitle(event.target.value)}
              type="text"
            />
            <label>Options</label>
            {newQuestionOptions.map((option, index) => (
              <div key={index} style={optionStyle}>
                <input
                  id={`option${index}`}
                  value={option}
                  checked={newQuestionCorrectIndex === index}
                  onChange={() => setNewQuestionCorrectIndex(index)}
                  type="radio"
                  style={optionRadioStyle}
                />
                <input
                  id={`questionOption${index}`}
                  value={option}
                  onChange={(event) =>
                    // Using slicing in order to adjust the value at the relevant index
                    setNewQuestionOptions([
                      ...newQuestionOptions.slice(0, index),
                      event.target.value,
                      ...newQuestionOptions.slice(index + 1),
                    ])
                  }
                  type="text"
                />
              </div>
            ))}
            <Message message={errorMessage} type="error" />
            <Message message={successMessage} type="confirm" />
            <button type="submit">Submit</button>
          </form>
          <div style={flexComponent}>
            <h3>Current Questions</h3>
            <ul>
              {questions.map((question) =>
                competition.questionIds.includes(question.title) ? (
                  <li key={question.title}>
                    <h4 style={questionTitleStyle}>{question.title}</h4>
                    <ul>
                      {question.options.map((option, index) => {
                        const correct =
                          question.correctIndexChoice === index ? "✔" : "✗";
                        return <li key={index}>{correct} - {option}</li>;
                      })}
                    </ul>
                  </li>
                ) : null
              )}
            </ul>
          </div>
        </div>
      </Collapsible>
    </li>
  );
};

export default Competition;
