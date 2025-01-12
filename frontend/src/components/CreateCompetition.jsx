import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";

import { accessTokenAtom } from "../atoms";
import platformApi from "../services/platform-api";
import Message from "./Message";

const CreateCompetition = ({ competitions, setCompetitions }) => {
  const accessToken = useAtomValue(accessTokenAtom);

  const [newCompetitionTitle, setNewCompetitionTitle] = useState("");
  const [newCompetitionStartDate, setNewCompetitionStartDate] = useState("");
  const [newCompetitionEndDate, setNewCompetitionEndDate] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Wipes error message when user starts re-entering information
  useEffect(() => {
    setErrorMessage(null);
  }, [newCompetitionTitle, newCompetitionStartDate, newCompetitionEndDate]);

  const clearCompetitionFields = () => {
    setNewCompetitionTitle("");
  };

  const createCompetition = (event) => {
    event.preventDefault();

    if (
      !newCompetitionTitle ||
      !newCompetitionStartDate ||
      !newCompetitionEndDate
    ) {
      setErrorMessage("Please fill in all fields");
      return;
    }
    if (
      competitions.find(
        (competition) => competition.title === newCompetitionTitle
      )
    ) {
      setErrorMessage("A competition with this title already exists");
      return;
    }

    const today = new Date();
    const startDate = new Date(newCompetitionStartDate);
    const endDate = new Date(newCompetitionEndDate);

    if (endDate < startDate) {
      setErrorMessage("The end date must not be before the start date");
      return;
    }
    if (startDate < today || endDate < today) {
      setErrorMessage("Start and end dates must be in the future");
      return;
    }

    const newCompetition = {
      title: newCompetitionTitle,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };

    platformApi
      .postCompetition(newCompetition, accessToken)
      .then((returnedCompetition) => {
        setCompetitions(competitions.concat(returnedCompetition));
        clearCompetitionFields();
        setSuccessMessage("Competition Created!");
        setTimeout(() => {
          setSuccessMessage(null);
        }, "3000");
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage("Error - Competition could not be created");
      });
  };

  return (
    <div>
      <h2>Create Competition</h2>
      <form onSubmit={createCompetition} autoComplete="off">
        <label htmlFor="competitionTitle">Title</label>
        <input
          id="competitionTitle"
          value={newCompetitionTitle}
          onChange={(event) => setNewCompetitionTitle(event.target.value)}
          type="text"
        />
        <label htmlFor="competitionStartDate">Start Date</label>
        <input
          id="competitionStartDate"
          value={newCompetitionStartDate}
          onChange={(event) => setNewCompetitionStartDate(event.target.value)}
          type="datetime-local"
        />
        <label htmlFor="competitionEndDate">End Date</label>
        <input
          id="competitionEndDate"
          value={newCompetitionEndDate}
          onChange={(event) => setNewCompetitionEndDate(event.target.value)}
          type="datetime-local"
        />
        <Message message={errorMessage} type="error" />
        <Message message={successMessage} type="confirm" />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateCompetition;
