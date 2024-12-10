const Event = ({ event }) => {
  return (
    <li className="item">
      <h3>{event.name}</h3>
      <p>{event.date}</p>
      <p>{event.description}</p>
    </li>
  );
};

export default Event;
