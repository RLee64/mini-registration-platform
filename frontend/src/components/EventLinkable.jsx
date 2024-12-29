import { useState } from "react";
import { useAtomValue } from "jotai";

import platformApi from "../services/platform-api";
import { accessTokenAtom } from "../atoms";
import SmallMessage from "./SmallMessage";

const EventLinkable = ({ event, events, setEvents, competitions }) => {
  const accessToken = useAtomValue(accessTokenAtom);

  const [editingLink, setEditingLink] = useState(false);
  const [selectedCompetitionId, setSelectedCompetitionId] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const linkedCompetitionIds = events.map((event) => event.competitionId);

  const unlinkedCompetitionIds = competitions.reduce((ids, competition) => {
    if (!linkedCompetitionIds.includes(competition.title)) {
      ids.push(competition.title);
    }
    return ids;
  }, []);

  const eventHolderStyle = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const eventStyle = {
    width: "60%",
  };

  const selectStyle = {
    display: "block",
    margin: "10px 0 10px 0",
    padding: 10,
    width: "100%",
    border: 0,
    backgroundColor: "rgb(57, 67, 87)",
    color: "rgba(255, 255, 255, 0.9)",
  };

  const wideButtonStyle = {
    width: 150,
  };

  const smallButtonStyle = {
    width: 100,
  };

  const rightMargin = {
    marginRight: 20,
  };

  const linkEvent = (submitEvent) => {
    submitEvent.preventDefault();

    if (!selectedCompetitionId) {
      setErrorMessage("Please include a competition");
      return;
    }
    
    const linkDetails = {
      eventName: event.name,
      competitionTitle: selectedCompetitionId,
    };

    platformApi
      .linkEvent(linkDetails, accessToken)
      .then((returnedEvent) => {
        setEvents(
          events.map((loopedEvent) =>
            loopedEvent.name === returnedEvent.name ? returnedEvent : loopedEvent
          )
        );
        setSelectedCompetitionId("");
        setSuccessMessage("Link Created!");
        setTimeout(() => {
          setSuccessMessage(null);
        }, "3000");
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage("Server Error - Try Again Later");
      });
  };

  return (
    <li className="item" style={eventHolderStyle}>
      <div style={eventStyle}>
        <h3>{event.name}</h3>
        <p>{event.date}</p>
        <p>{event.description}</p>
        <p>
          {`Competition: ${event.competitionId ? event.competitionId : "N/A"}`}
        </p>
      </div>
      {editingLink ? (
        <form onSubmit={linkEvent}>
          <SmallMessage message={errorMessage} type="error" />
          <SmallMessage message={successMessage} type="success" />
          <select
            id="competitions"
            name="competitions"
            style={selectStyle}
            onChange={(event) => setSelectedCompetitionId(event.target.value)}
            onClick={() => setErrorMessage(null)}
          >
            <option value="">Select a competition</option>
            {unlinkedCompetitionIds.map((id) => (
              <option key={id}>{id}</option>
            ))}
          </select>
          <button type="submit" style={{ ...smallButtonStyle, ...rightMargin }}>
            Link
          </button>
          <button
            type="button"
            style={smallButtonStyle}
            onClick={() => {
              setEditingLink(false);
              setErrorMessage(null);
            }}
          >
            Close
          </button>
        </form>
      ) : (
        <button style={wideButtonStyle} onClick={() => setEditingLink(true)}>
          {event.competitionId ? "Edit Link" : "Link Competition"}
        </button>
      )}
    </li>
  );
};

export default EventLinkable;
