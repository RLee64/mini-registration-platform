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
  };

  const joinEvent = () => {
    platformApi
      .joinEvent(event.name, accessToken)
      .then((response) => {
        setAccount({ ...account, joinedEvents: response.joinedEvents });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <li style={eventHolderStyle} className="item">
      <div style={eventStyle}>
        <h3>{event.name}</h3>
        <p>{event.date}</p>
        <p>{event.description}</p>
      </div>
      {account.joinedEvents?.find((eventName) => eventName === event.name) ? (
        <label style={joinStyle}>Joined!</label>
      ) : (
        <button style={joinStyle} onClick={joinEvent}>
          Join Event
        </button>
      )}
    </li>
  );
};

export default EventJoinable;
