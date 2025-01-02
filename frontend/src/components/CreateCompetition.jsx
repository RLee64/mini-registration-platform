import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";

import { accessTokenAtom } from "../atoms";
import platformApi from "../services/platform-api";
import Message from "./Message";

const CreateCompetition = ({ competitions, setCompetitions }) => {
  const accessToken = useAtomValue(accessTokenAtom);

  const [newCompetitionTitle, setNewCompetitionTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Wipes error message when user starts re-entering information
  useEffect(() => {
    setErrorMessage(null);
  }, [newCompetitionTitle]);

  const clearCompetitionFields = () => {
    setNewCompetitionTitle("")
  };

  const createCompetition = (event) => {
    event.preventDefault();

    if (!newCompetitionTitle) {
      setErrorMessage("Please add a title before submitting");
      return;
    }
    if (competitions.find((competition) => competition.title === newCompetitionTitle)) {
      setErrorMessage("A competition with this title already exists");
      return;
    }

    const newCompetition = {
      title: newCompetitionTitle,
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
        <Message message={errorMessage} type="error" />
        <Message message={successMessage} type="confirm" />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateCompetition;
