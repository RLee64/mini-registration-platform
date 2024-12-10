import { useAtomValue } from "jotai";
import { useState } from "react";

import { accessTokenAtom } from "../atoms";
import platformApi from "../services/platform-api";

const CreateEvent = ({ events, setEvents }) => {
  const accessToken = useAtomValue(accessTokenAtom);

  const [newEventName, setNewEventName] = useState("");
  const [newEventDescription, setNewEventDescription] = useState("");
  const [newEventDate, setNewEventDate] = useState("");

  const clearEventFields = () => {
    setNewEventName("");
    setNewEventDescription("");
    setNewEventDate("");
  };

  const createEvent = (event) => {
    event.preventDefault();
    console.log("Creating event");

    const newEvent = {
      name: newEventName,
      description: newEventDescription,
      date: newEventDate,
    };

    platformApi.postEvent(newEvent, accessToken).then((returnedEvent) => {
      setEvents(events.concat(returnedEvent));
      clearEventFields();
    });
  };

  return (
    <div>
      <h2>Create Event</h2>
      <form onSubmit={createEvent}>
        <label htmlFor="eventName">Name</label>
        <input
          id="eventName"
          value={newEventName}
          onChange={(event) => setNewEventName(event.target.value)}
          type="text"
        />
        <label htmlFor="eventDescription">Description</label>
        <input
          id="eventDescription"
          value={newEventDescription}
          onChange={(event) => setNewEventDescription(event.target.value)}
          type="text"
        />
        <label id="eventDate">Date</label>
        <input
          id="eventDate"
          value={newEventDate}
          onChange={(event) => setNewEventDate(event.target.value)}
          type="datetime-local"
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateEvent;
