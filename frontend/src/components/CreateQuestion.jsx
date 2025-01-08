import { useAtomValue } from "jotai";
import { useState, useEffect } from "react";

import { accessTokenAtom } from "../atoms";
import Message from "./Message";
import platformApi from "../services/platform-api";

const CreateQuestion = ({ questions, setQuestions }) => {
  // Questions currently require 4 options, but can changed easily by adjusting the backend and changing the below value
  const optionNo = 4;

  // Add more tags when required
  const tags = {
    Difficulty: ["Easy", "Medium", "Hard"],
    Topics: ["Mechanics", "Waves", "Algebra", "Geometry"],
  };

  const accessToken = useAtomValue(accessTokenAtom);

  const [newQuestionTitle, setNewQuestionTitle] = useState("");
  const [newQuestionOptions, setNewQuestionOptions] = useState(
    new Array(optionNo).fill("")
  );
  const [newQuestionCorrectIndex, setNewQuestionCorrectIndex] = useState(null);
  const [newTags, setNewTags] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const optionStyle = {
    display: "flex",
    gap: 15,
    marginBottom: -8,
  };

  const optionRadioStyle = {
    width: 20,
    height: 20,
  };

  const tagTitleStyle = {
    marginBottom: 15,
    display: "block",
    borderBottom: "3px solid rgba(34, 40, 51, 0.84)",
    paddingBottom: 5,
  };

  const tagHolderStyle = {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    alignContent: "center",
  };


  const tagSecondaryColor = "rgba(80, 86, 112, 0.32)";
  const finalTagHolderMargin = 15;

  const tagNameStyle = {
    padding: 12,
    fontSize: 14,
    display: "inline-block",
  };

  const tagSelectStyle = {
    margin: 8,
    width: 150,
    maxWidth: "60%",
    fontSize: 12,
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

    console.log(newTags);
    
    if (
      !newQuestionTitle ||
      newQuestionOptions.some((option) => option === "" || option === null)
    ) {
      setErrorMessage("Please fill in the title and option boxes");
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
      tags: Object.keys(newTags).length === 0 ? null : newTags,
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
      <label style={tagTitleStyle}>Tags</label>
      {Object.entries(tags).map(([tagName, tagOptions], nameIndex) => (
        <div
          key={nameIndex}
          // Styling here is a bit weird, it has a generic style, but also alternates in background colour and applies a padding to the last element
          style={{
            ...tagHolderStyle,
            backgroundColor: nameIndex % 2 === 0 ? tagSecondaryColor : null,
            marginBottom: Object.keys(tags).length === nameIndex + 1 ? finalTagHolderMargin : 0
          }}
        >
          <label htmlFor={`questionTag${nameIndex}`} style={tagNameStyle}>
            {tagName}
          </label>
          <select
            name={`questionTag${nameIndex}`}
            id={`questionTag${nameIndex}`}
            onChange={(event) =>
              setNewTags({ ...newTags, [tagName]: event.target.value })
            }
            onClick={() => setErrorMessage(null)}
            style={tagSelectStyle}
          >
            <option id={0} value={null}>
              select an option
            </option>
            {tagOptions.map((tagOption, optionIndex) => (
              <option
                key={optionIndex + 1}
                id={optionIndex + 1}
                value={tagOption}
              >
                {tagOption}
              </option>
            ))}
          </select>
        </div>
      ))}
      <Message message={errorMessage} type="error" />
      <Message message={successMessage} type="confirm" />
      <button type="submit">Submit</button>
    </form>
  );
};

export default CreateQuestion;
