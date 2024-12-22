import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import Collapsible from "react-collapsible";
import { accessTokenAtom } from "../atoms";

import Message from "./Message";
import platformApi from "../services/platform-api";

const Competition = ({ competition, questions }) => {
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
        console.log("CREATED QUESTION");
        console.log(returnedQuestion);

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
      <Collapsible trigger="Questions" transitionTime={200}>
        <p>Questions: {competition.questionIds.length}</p>
        <form onSubmit={createQuestion}>
          <label htmlFor="questionTitle">Title</label>
          <input
            id="questionTitle"
            value={newQuestionTitle}
            onChange={(event) => setNewQuestionTitle(event.target.value)}
            type="text"
          />
          {newQuestionOptions.map((option, index) => (
            <div key={index}>
              <input
                id={`option${index}`}
                value={option}
                checked={newQuestionCorrectIndex === index}
                onChange={() => setNewQuestionCorrectIndex(index)}
                type="radio"
              />
              <label htmlFor={`questionOption${index}`}>
                Option {index + 1}
              </label>
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
        <ul>
          {questions.map((question) =>
            competition.questionIds.includes(question.title) ? (
              <li key={question.title}>{question.title}</li>
            ) : null
          )}
        </ul>
      </Collapsible>
    </li>
  );
};

export default Competition;
