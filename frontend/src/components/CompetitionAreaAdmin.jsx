import Competition from './Competition'
import CreateCompetition from "./CreateCompetition"

const CompetitionAreaAdmin = ({competitions, setCompetitions, questions, setQuestions}) => {
  const flexBoxWrapper = {
    display: "flex",
    flexDirection: "row",
    gap: 80,
    padding: "0 10px"
  };

  const flexComponentMajor = {
    width: "70%",
  };

  const flexComponentMinor = {
    width: "20%",
  };

  return (
    <div style={flexBoxWrapper}>
      <div style={flexComponentMajor}>
        <h2>Active</h2>
        <ul>
          {competitions.map((competition) => (
            <Competition key={competition.title} competition={competition} questions={questions} setQuestions={setQuestions}/>
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
