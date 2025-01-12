import { useState } from "react";
import { useAtomValue } from "jotai";

import SmallMessage from "./SmallMessage";
import platformApi from "../services/platform-api";
import { accessTokenAtom } from "../atoms";

const Question = ({ question, competitions, setCompetitions }) => {
  const accessToken = useAtomValue(accessTokenAtom);

  const [editingLink, setEditingLink] = useState(false);
  const [selectedCompetitionId, setSelectedCompetitionId] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const competitionIds = competitions.map((competition) => competition.title);

  const mainStyle = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 20,
    gap: 40,
  };

  const questionStyle = {
    width: "60%",
  };

  const selectStyle = {
    display: "block",
    margin: "10px 0 10px 0",
    padding: 10,
    width: "100%",
    border: 0,
    backgroundColor: "rgb(57, 67, 87)",
    color: "rgba(255, 255, 255, 0.9)",
  };

  const wideButtonStyle = {
    width: 150,
  };

  const smallButtonStyle = {
    width: 100,
  };

  const questionTitleStyle = {
    margin: "20px 0 10px 0",
    paddingBottom: 5,
    borderBottom: "2px solid rgb(61, 60, 83)",
  };

  const tagStyle = {
    marginTop: 12,
    paddingTop: 8,
    borderTop: "2px solid rgb(61, 60, 83)",
  }

  const linkQuestion = (event) => {
    event.preventDefault();

    if (!selectedCompetitionId) {
      setErrorMessage("Please include a competition");
      return;
    }

    const linkDetails = {
      competitionTitle: selectedCompetitionId,
      questionTitle: question.title,
    };

    platformApi
      .linkQuestion(linkDetails, accessToken)
      .then((returnedCompetition) => {
        setCompetitions(
          competitions.map((competition) =>
            competition.title === returnedCompetition.title
              ? returnedCompetition
              : competition
          )
        );
        setSelectedCompetitionId("");
        setSuccessMessage("Question Added!");
        setTimeout(() => {
          setSuccessMessage(null);
        }, "3000");
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage("Server Error - Try Again Later");
      });
  };

  return (
    <li className="item" style={mainStyle}>
      <div style={questionStyle}>
        <h4 style={questionTitleStyle}>{question.title}</h4>
        <ul>
          {question.options.map((option, index) => {
            const correct = question.correctIndexChoice === index ? "✔" : "✗";
            return (
              <li key={index}>
                {correct} - {option}
              </li>
            );
          })}
        </ul>
        <p style={tagStyle}>
        {question.tags ? (
          <>
            <strong>Tags - </strong>
            {Object.entries(question.tags).map(([tag, option], index) => (
              <span key={index}>
                {`${tag}: ${option} || `}
              </span>
            ))}
          </>
        ) : (
          <>No tags</>
        )}
        </p>
      </div>
      <div>
        {editingLink ? (
          <form onSubmit={linkQuestion} autoComplete="off">
            <SmallMessage message={errorMessage} type="error" />
            <SmallMessage message={successMessage} type="success" />
            <select
              name="competitions"
              style={selectStyle}
              onChange={(event) => setSelectedCompetitionId(event.target.value)}
              onClick={() => setErrorMessage(null)}
            >
              <option value="">Select a competition</option>
              {competitionIds.map((id) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
            </select>
            <button
              type="submit"
              style={{ ...smallButtonStyle, marginRight: 20 }}
            >
              Submit
            </button>
            <button
              type="button"
              style={smallButtonStyle}
              onClick={() => setEditingLink(false)}
            >
              Cancel
            </button>
          </form>
        ) : (
          <button
            onClick={() => {
              setEditingLink(true);
              setErrorMessage(null);
            }}
            style={wideButtonStyle}
          >
            Add to Competition
          </button>
        )}
      </div>
    </li>
  );
};

export default Question;
