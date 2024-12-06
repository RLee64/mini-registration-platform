import { useState, useEffect } from "react";

import platformApi from "../services/platform-api";

const AdminPage = () => {
  const [events, setEvents] = useState([]);
  const [accounts, setAccounts] = useState([]);

  const [newEventName, setNewEventName] = useState("");
  const [newEventDescription, setNewEventDescription] = useState("");
  const [newEventDate, setNewEventDate] = useState("");

  /*Currently events and accounts are only called for at the beginning,
  meaning refreshing is currently required to keep track of updates.
  Maybe a potential fix would be nice? But it's not necessary*/
  useEffect(() => {
    platformApi.getEvents().then((receivedEvents) => {
      setEvents(receivedEvents);
    });
  }, []);

  useEffect(() => {
    platformApi.getAccounts().then((receivedAccounts) => {
      setAccounts(receivedAccounts);
    });
  }, []);


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

    platformApi.postEvent(newEvent).then((returnedEvent) => {
      setEvents(events.concat(returnedEvent));
      clearEventFields();
    });
  };

  return (
    <div>
      ADMIN STUFF
      <div>
        EVENTS
        <ul>
          {events.map((event) => (
            <li key={event.id}>{event.name}</li>
          ))}
        </ul>
      </div>
      <div>
        CREATE EVENT
        <form onSubmit={createEvent}>
          name{" "}
          <input
            value={newEventName}
            onChange={(event) => setNewEventName(event.target.value)}
            type="text"
          />
          description{" "}
          <input
            value={newEventDescription}
            onChange={(event) => setNewEventDescription(event.target.value)}
            type="text"
          />
          date{" "}
          <input
            value={newEventDate}
            onChange={(event) => setNewEventDate(event.target.value)}
            type="date"
          />
          <button type="submit">Submit</button>
        </form>
      </div>
      <div>
        ACCOUNTS
        <ul>
          {accounts.map((account) => (
            <li key={account.id}>{account.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPage;
