import CreateQuestion from "./CreateQuestion";
import Question from "./Question";

const QuestionAreaAdmin = ({ questions, setQuestions, competitions, setCompetitions }) => {
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
        <ul>
          {questions.map((question) => (
            <Question
              key={question.title}
              question={question}
              competitions={competitions}
              setCompetitions={setCompetitions}
            />
          ))}
        </ul>
      </div>
      <div style={minorSectionStyle}>
        <CreateQuestion questions={questions} setQuestions={setQuestions} />
      </div>
    </div>
  );
};

export default QuestionAreaAdmin;
