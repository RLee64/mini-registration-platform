const Question = ({ question }) => {
  const questionStyle = {
    paddingBottom: 20,
  };
  
  const questionTitleStyle = {
    margin: "20px 0 5px 0",
    paddingBottom: 5,
    borderBottom: "3px solid rgb(61, 60, 83)",
  };

  return (
    <li className="item" style={questionStyle}>
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
    </li>
  );
};

export default Question;
