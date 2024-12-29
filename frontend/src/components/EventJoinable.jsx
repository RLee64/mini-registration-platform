import { useAtomValue } from "jotai";

import platformApi from "../services/platform-api";
import { accessTokenAtom } from "../atoms";
import { useNavigate } from "react-router-dom";

// Displays events and allows users to join them
const EventJoinable = ({ event, account, setAccount }) => {
  const accessToken = useAtomValue(accessTokenAtom);

  const navigate = useNavigate();

  const joinedEvent = account.joinedEvents?.find(
    (eventName) => eventName === event.name
  );

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

  const startButtonStyle = {
    width: 150,
    margin: "10px 0 15px 0",
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

  const startCompetition = () => {
    navigate(`event?name=${event.name}`)
  };

  return (
    <li style={eventHolderStyle} className="item">
      <div style={eventStyle}>
        <h3>{event.name}</h3>
        <p>{event.date}</p>
        <p>{event.description}</p>
        {joinedEvent ? (
          event.competitionId ? (
            <button style={startButtonStyle} onClick={startCompetition}>Start Competition</button>
          ) : (
            <p>
              <em>Event joined, please wait until the event date to start</em>
            </p>
          )
        ) : null}
      </div>
      {joinedEvent ? (
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
