import { useEffect, useState } from 'react';
import { useAtomValue } from "jotai";

import Competition from './Competition'
import CreateCompetition from "./CreateCompetition"
import { accessTokenAtom } from "../atoms";
import platformApi from '../services/platform-api';

const CompetitionAreaAdmin = ({competitions, setCompetitions}) => {
  const accessToken = useAtomValue(accessTokenAtom);

  const [ questions, setQuestions ] = useState([]);

  const flexBoxWrapper = {
    display: "flex",
    flexDirection: "row",
    gap: 80,
    padding: "0 10px"
  };

  const flexComponentMajor = {
    width: "55%",
  };

  const flexComponentMinor = {
    width: "30%",
  };

  useEffect(() => {
    platformApi.getQuestions(accessToken).then((receivedQuestions) => {
      setQuestions(receivedQuestions);
    });
  }, []);

  return (
    <div style={flexBoxWrapper}>
      <div style={flexComponentMajor}>
        <h2>Active</h2>
        <ul>
          {competitions.map((competition) => (
            <Competition key={competition.title} competition={competition} questions={questions}/>
          ))}
        </ul>
      </div>
      <div style={flexComponentMinor}>
        <CreateCompetition competitions={competitions} setCompetitions={setCompetitions}/>
      </div>
    </div>
  );
};

export default CompetitionAreaAdmin;
