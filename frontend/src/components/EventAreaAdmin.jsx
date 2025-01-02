import EventLinkable from "./EventLinkable";
import CreateEvent from "../components/CreateEvent";

const EventAreaAdmin = ({ events, setEvents, competitions }) => {
  const flexBoxWrapper = {
    display: "flex",
    flexDirection: "row",
    gap: 80,
    padding: "0 10px",
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
        <h2>Active</h2>
        <ul>
          {events.map((event) => (
            <EventLinkable
              key={event.name}
              event={event}
              events={events}
              setEvents={setEvents}
              competitions={competitions}
            />
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
