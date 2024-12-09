import { useState, useEffect } from "react";
import { useAtomValue } from "jotai";

import platformApi from "../services/platform-api";
import { accessTokenAtom } from "../atoms";

import Account from "../components/Account";
import Event from "../components/Event";

const AdminPage = () => {
  const accessToken = useAtomValue(accessTokenAtom);

  const [events, setEvents] = useState([]);
  const [accounts, setAccounts] = useState([]);

  const [newEventName, setNewEventName] = useState("");
  const [newEventDescription, setNewEventDescription] = useState("");
  const [newEventDate, setNewEventDate] = useState("");

  /*Currently events and accounts are only called for at the beginning,
  meaning refreshing is currently required to keep track of updates.
  Maybe a potential fix would be nice? But it's not necessary*/
  useEffect(() => {
    platformApi.getAccounts(accessToken).then((receivedAccounts) => {
      setAccounts(receivedAccounts);
      console.log(receivedAccounts)
    });
  }, []);

  useEffect(() => {
    platformApi.getEvents().then((receivedEvents) => {
      setEvents(receivedEvents);
      console.log(receivedEvents);
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

    platformApi.postEvent(newEvent, accessToken).then((returnedEvent) => {
      setEvents(events.concat(returnedEvent));
      clearEventFields();
    });
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      <div>
        <h2>Events</h2>
        <ul>
          {events.map((event) => (
            <Event key={event.id} event={event} />
          ))}
        </ul>
      </div>
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
      <div>
        <h2>Registered Accounts</h2>
        <ul>
          {accounts.map((account) => (
            <Account key={account.id} account={account} events={events} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPage;
