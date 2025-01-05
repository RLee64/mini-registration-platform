import { useAtomValue } from "jotai";
import { useState, useEffect } from "react";

import { accessTokenAtom } from "../atoms";
import Message from "./Message";
import platformApi from "../services/platform-api";

const CreateQuestion = ({questions, setQuestions}) => {
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

  const optionStyle = {
    display: "flex",
    gap: 15,
    marginBottom: -8,
  };

  const optionRadioStyle = {
    width: 25,
    height: 25,
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
      return;
    }

    const newQuestion = {
      title: newQuestionTitle,
      options: newQuestionOptions,
      correctIndexChoice: newQuestionCorrectIndex,
    };

    platformApi
      .postQuestion(newQuestion, accessToken)
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
    <form onSubmit={createQuestion} autoComplete="off">
      <h2>Create New Quesiton</h2>
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
  );
};

export default CreateQuestion