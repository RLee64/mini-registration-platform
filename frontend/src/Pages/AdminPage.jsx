import { useState, useEffect } from "react";

import platformApi from "../Services/platform-api";

const AdminPage = () => {
  const [events, setEvents] = useState([]);
  const [accounts, setAccounts] = useState([]);

  const [newEventName, setNewEventName] = useState("");
  const [newEventDescription, setNewEventDescription] = useState("");
  const [newEventDate, setNewEventDate] = useState("");

  const createEvent = (event) => {
    event.preventDefault();
    console.log("Creating event");
  };

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
          name <input value={newEventName} onChange={setNewEventName} />
          description{" "}
          <input
            value={newEventDescription}
            onChange={setNewEventDescription}
          />
          date{" "}
          <input value={newEventDate} onChange={setNewEventDate} type="date" />
          <button type="submit">Login</button>
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
