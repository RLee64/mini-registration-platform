const Event = ({ event }) => {
  return (
    <li>
      <ul>
        <li>{event.name}</li>
        <li>{event.description}</li>
        <li>{event.date}</li>
      </ul>
    </li>
  );
};

export default Event;
