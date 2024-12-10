import { useAtomValue } from "jotai";

import platformApi from "../services/platform-api";
import { accessTokenAtom } from "../atoms";

// Displays events and allows users to join them
const EventJoinable = ({ event, account, setAccount }) => {
  const accessToken = useAtomValue(accessTokenAtom);

  const eventHolderStyle = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 50,
  };

  const eventStyle = {
    width: "80%",
  };

  const joinStyle = {
    width: 125,
    textAlign: "center",

  }

  const joinEvent = () => {
    platformApi.joinEvent(event.id, accessToken).then((response) => {
      console.log("successful in joining event");
      console.log(response.joinedEvents);
      setAccount({ ...account, joinedEvents: response.joinedEvents });
    });
  };

  return (
    <li style={eventHolderStyle} className="item">
      <div style={eventStyle}>
        <h3>{event.name}</h3>
        <p>{event.date}</p>
        <p>{event.description}</p>
      </div>
      {account.joinedEvents?.find((eventId) => eventId === event.id) ? (
        <label style={joinStyle}>Joined!</label>
      ) : (
        <button style={joinStyle} onClick={joinEvent}>Join Event</button>
      )}
    </li>
  );
};

export default EventJoinable;
