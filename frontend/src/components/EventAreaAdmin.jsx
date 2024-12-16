import Event from "../components/Event";
import CreateEvent from "../components/CreateEvent";

const EventAreaAdmin = ({ events, setEvents }) => {
  const flexBoxWrapper = {
    display: "flex",
    flexDirection: "row",
    gap: 80,
  };

  const flexComponentMajor = {
    width: "55%",
  };

  const flexComponentMinor = {
    width: "30%",
  };

  return (
    <div style={flexBoxWrapper}>
      <div style={flexComponentMajor}>
        <h2>Events</h2>
        <ul>
          {events.map((event) => (
            <Event key={event.name} event={event} />
          ))}
        </ul>
      </div>
      <div style={flexComponentMinor}>
        <CreateEvent events={events} setEvents={setEvents} />
      </div>
    </div>
  );
};

export default EventAreaAdmin;
