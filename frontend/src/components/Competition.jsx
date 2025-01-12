import Collapsible from "react-collapsible";

const Competition = ({ competition, questions }) => {
  const triggerStyle = {
    fontSize: 16,
    backgroundColor: "rgba(148, 146, 196, 0.2)",
    padding: 8,
    borderBottom: "2px solid rgba(67, 63, 83, 0.73))",
    marginBottom: 15,
  };

  const questionHolderStyle = {
    paddingLeft: 8,
    width: "70%",
    marginBottom: 20,
    marginTop: -20,
  };

  const questionTitleStyle = {
    margin: "30px 0 5px 0",
    paddingBottom: 5,
    borderBottom: "2px solid rgb(61, 60, 83)",
  };

  const basicInfoStyle = {
    display: "flex",
    flexDirection: "row",
    gap: 40,
    marginTop: -10,
    marginBottom: 10,
  };

  return (
    <li className="item">
      <h3>{competition.title}</h3>
      <div style={basicInfoStyle}>
        <div>
          <p>Start Date:</p>
          <p>End Date:</p>
          <p>Total Question Count:</p>
        </div>
        <div>
          <p>{new Date(competition.startDate).toLocaleString('en-GB')}</p>
          <p>{new Date(competition.endDate).toLocaleString('en-GB')}</p>
          <p>{competition.questionIds.length}</p>
        </div>
      </div>
      <Collapsible
        trigger="Questions"
        triggerStyle={triggerStyle}
        transitionTime={200}
      >
        <ul style={questionHolderStyle}>
          {questions.map((question) =>
            competition.questionIds.includes(question.title) ? (
              <li key={question.title}>
                <h4 style={questionTitleStyle}>{question.title}</h4>
                <ul>
                  {question.options.map((option, index) => {
                    const correct =
                      question.correctIndexChoice === index ? "✔" : "✗";
                    return (
                      <li key={index}>
                        {correct} - {option}
                      </li>
                    );
                  })}
                </ul>
              </li>
            ) : null
          )}
        </ul>
      </Collapsible>
    </li>
  );
};

export default Competition;
