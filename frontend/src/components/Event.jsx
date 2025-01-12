const Event = ({ event }) => {
  return (
    <li className="item">
      <h3>{event.name}</h3>
      <p>{new Date(event.date).toLocaleString('en-GB')}</p>
      <p>{event.description}</p>
    </li>
  );
};

export default Event;
