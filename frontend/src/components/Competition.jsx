const Competition = ({ competition }) => {
  return (
    <li className="item">
      <h3>{competition.title}</h3>
      <p>Questions: {competition.questionIds.length}</p>
    </li>
  );
};

export default Competition;
