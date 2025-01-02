import { useAtomValue } from "jotai";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import platformApi from "../services/platform-api";
import { accessTokenAtom } from "../atoms";

// Displays events and allows users to join them
const EventJoinable = ({ event, account, setAccount }) => {
  const accessToken = useAtomValue(accessTokenAtom);

  const navigate = useNavigate();

  const [attemptExists, setAttemptExists] = useState(null);

  const joinedEvent = account.joinedEvents?.find(
    (eventName) => eventName === event.name
  );

  if (joinedEvent && event.competitionId) {
    platformApi
      .attemptExists(event.competitionId, accessToken)
      .then((response) => {
        setAttemptExists(response);
      });
  }

  console.log(attemptExists);

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

  const attemptExistsStyle = {
    borderTop: "2px solid rgba(63, 66, 75, 0.68)",
    paddingTop: 20,
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
    navigate(`event/${event.name}`);
  };

  return (
    <li style={eventHolderStyle} className="item">
      <div style={eventStyle}>
        <h3>{event.name}</h3>
        <p>{event.date}</p>
        <p>{event.description}</p>
        {joinedEvent ? (
          event.competitionId ? (
            attemptExists ? (
              <p style={attemptExistsStyle}>
                <em>An attempt has been submitted</em>
              </p>
            ) : (
              <button style={startButtonStyle} onClick={startCompetition}>
                Start Competition {attemptExists}
              </button>
            )
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
