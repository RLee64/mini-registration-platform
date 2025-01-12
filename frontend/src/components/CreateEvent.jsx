import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";

import { accessTokenAtom } from "../atoms";
import platformApi from "../services/platform-api";
import Message from "./Message";

const CreateEvent = ({ events, setEvents }) => {
  const accessToken = useAtomValue(accessTokenAtom);

  const [newEventName, setNewEventName] = useState("");
  const [newEventDescription, setNewEventDescription] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const descriptionStyle = {
    width: "100%",
    boxSizing: "border-box",
    display: "block",
    resize: "none",
    fontFamily: "inherit",
    margin: "10px 0 35px 0",
  };

  // Wipes error message when user starts re-entering information
  useEffect(() => {
    setErrorMessage(null);
  }, [newEventName, newEventDescription, newEventDate]);

  const clearEventFields = () => {
    setNewEventName("");
    setNewEventDescription("");
    setNewEventDate("");
  };

  const createEvent = (event) => {
    event.preventDefault();

    const today = new Date();
    const eventDate = new Date(newEventDate);

    if (!newEventName || !newEventDescription || !newEventDate) {
      setErrorMessage("Please fill in all fields");
      return;
    }
    if (events.find((event) => event.name === newEventName)) {
      setErrorMessage("An event with this name already exists");
      return;
    }
    if (eventDate < today) {
      setErrorMessage("Chosen date is in the past");
      return;
    }

    const newEvent = {
      name: newEventName,
      description: newEventDescription,
      date: eventDate.toISOString(),
    };

    platformApi
      .postEvent(newEvent, accessToken)
      .then((returnedEvent) => {
        setEvents(events.concat(returnedEvent));
        clearEventFields();
        setSuccessMessage("Event Posted!");
        setTimeout(() => {
          setSuccessMessage(null);
        }, "3000");
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage("Error - Event could not be created");
      });
  };

  return (
    <div>
      <h2>Create Event</h2>
      <form onSubmit={createEvent} autoComplete="off">
        <label htmlFor="eventName">Name</label>
        <input
          id="eventName"
          value={newEventName}
          onChange={(event) => setNewEventName(event.target.value)}
          type="text"
        />
        <label htmlFor="eventDescription">Description</label>
        <textarea
          style={descriptionStyle}
          id="eventDescription"
          value={newEventDescription}
          onChange={(event) => setNewEventDescription(event.target.value)}
          rows="4"
        ></textarea>
        <label htmlFor="eventDate">Date</label>
        <input
          id="eventDate"
          value={newEventDate}
          onChange={(event) => setNewEventDate(event.target.value)}
          type="datetime-local"
        />
        <Message message={errorMessage} type="error" />
        <Message message={successMessage} type="confirm" />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateEvent;
