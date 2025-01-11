import { useState } from "react";

import CreateQuestion from "./CreateQuestion";
import Question from "./Question";

const QuestionAreaAdmin = ({
  questions,
  setQuestions,
  competitions,
  setCompetitions,
}) => {
  const filterOptions = questions.reduce((acc, question) => {
    // Only proceed if tags exist
    if (question.tags) {
      Object.entries(question.tags).forEach(([tag, option]) => {
        if (acc[tag] && !acc[tag].includes(option)) {
          // Push if tag already exists but option doesn't
          acc[tag].push(option);
        } else {
          // Add new tag
          acc[tag] = [option];
        }
      });
    }
    return acc;
  }, {});

  const [filters, setFilters] = useState({});

  // This next bit feels like a bit of a headache to try and understand, so I'll try explain it
  // We want to filter out the questions so only the questions matching the filter criteria remain
  // To do this, we check whether any of our filters are mismatched with the question tags
  // So when the "some" function returns true, our criteria has not been met so the question gets filtered out
  // When all filters pass, the function instead returns false which gets flipped to a true and the question is kept
  const filteredQuestions = questions.filter(
    (question) =>
      !Object.entries(filters).some(([filter, option]) => {
        if (option) {
          if (question.tags?.[filter] !== option) return true;
        }
      })
  );

  const mainStyle = {
    display: "flex",
    flexDirection: "row",
    gap: 80,
    padding: "0 10px",
  };

  const majorSectionStyle = {
    width: "60%",
  };

  const minorSectionStyle = {
    width: "30%",
  };

  return (
    <div style={mainStyle}>
      <div style={majorSectionStyle}>
        <h2>Question Pool</h2>
        <h3>Filter</h3>
        {Object.entries(filterOptions).map(([filter, options], filterIndex) => (
          <div key={filterIndex}>
            <label htmlFor={`filter${filterIndex}`}>{filter}</label>
            <select
              name={`filter${filterIndex}`}
              id={`filter${filterIndex}`}
              onChange={(event) =>
                setFilters({ ...filters, [filter]: event.target.value })
              }
            >
              <option value={""}></option>
              {options.map((option, optionIndex) => (
                <option key={optionIndex} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        ))}
        {filteredQuestions.length !== 0 ? (
          <ul>
            {filteredQuestions.map((question) => (
              <Question
                key={question.title}
                question={question}
                competitions={competitions}
                setCompetitions={setCompetitions}
              />
            ))}
          </ul>
        ) : (
          <p>No Questions Found</p>
        )}
      </div>
      <div style={minorSectionStyle}>
        <CreateQuestion questions={questions} setQuestions={setQuestions} />
      </div>
    </div>
  );
};

export default QuestionAreaAdmin;
