import { useAtomValue } from "jotai";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import platformApi from "../services/platform-api";
import { accessTokenAtom } from "../atoms";

// Displays events and allows users to join them
const EventJoinable = ({ event, account, setAccount }) => {
  const accessToken = useAtomValue(accessTokenAtom);

  const navigate = useNavigate();

  const [attemptExists, setAttemptExists] = useState(null);
  const [competitionStartDate, setCompetitionStartDate] = useState("");
  const [competitionEndDate, setCompetitionEndDate] = useState("");

  const joinedEvent = account.joinedEvents?.find(
    (eventName) => eventName === event.name
  );

  useEffect(() => {
    if (joinedEvent && event.competitionId) {
      platformApi
        .attemptExists(event.competitionId, accessToken)
        .then((response) => {
          setAttemptExists(response);
        });
      platformApi.getCompetitionDates(event.competitionId).then((response) => {
        setCompetitionStartDate(new Date(response.startDate));
        setCompetitionEndDate(new Date(response.endDate));
      });
    }
  }, [joinedEvent, event.competitionId]);

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

  let competitionState;
  
  if (joinedEvent) {
    if (event.competitionId) {
      if (new Date() < competitionStartDate) {
        competitionState = (
          <p>
            <em>
              Competition will open at{" "}
              {competitionStartDate.toLocaleString("en-GB")}
            </em>
          </p>
        );
      } else if (attemptExists) {
        competitionState = (
          <p style={attemptExistsStyle}>
            <em>An attempt has been submitted!</em>
          </p>
        );
      } else if (new Date() > competitionEndDate) {
        competitionState = <p>Competition has expired</p>;
      } else {
        competitionState = (
          <button style={startButtonStyle} onClick={startCompetition}>
            Start Competition {attemptExists}
          </button>
        );
      }
    } else {
      competitionState = (
        <p>
          <em>Event joined, check again closer to the start date</em>
        </p>
      );
    }
  } else {
    competitionState = null;
  }

  return (
    <li style={eventHolderStyle} className="item">
      <div style={eventStyle}>
        <h3>{event.name}</h3>
        <p>{new Date(event.date).toLocaleString("en-GB")}</p>
        <p>{event.description}</p>
        {competitionState}
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
