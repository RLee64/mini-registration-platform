import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";

import platformApi from "../services/platform-api";
import { accessTokenAtom } from "../atoms";
import EditName from "../components/EditName";

const EventJoinable = ({event, account, setAccount}) => {
  console.log(account.joinedEvents)
  const accessToken = useAtomValue(accessTokenAtom);
  console.log(accessToken)
  const joinEvent = () => {
    platformApi.joinEvent(event.id, accessToken).then((joinedEvent) => {
      console.log("successful in joining event");
      console.log(joinedEvent)
      setAccount({...account, joinedEvents: account.joinedEvents.concat(joinedEvent.id)})
    });
  };
  return (
    <li>
      <p>{event.name}</p>
      {account.joinedEvents?.find((eventId) => eventId === event.id) ? (
        <label>Joined!</label>
      ) : (
        <button onClick={joinEvent}>Join Event</button>
      )}
    </li>
  );
};

const LandingSignedInPage = () => {
  console.log("refreshing page")
  const accessToken = useAtomValue(accessTokenAtom);

  const [events, setEvents] = useState([]);
  const [account, setAccount] = useState([]);

  useEffect(() => {
    platformApi.getEvents().then((receivedEvents) => {
      console.log(receivedEvents)
      setEvents(receivedEvents);
    });
  }, [account]);

  useEffect(() => {
    platformApi.getAccounts(accessToken).then((receivedAccount) => {
      setAccount(receivedAccount);
    });
  }, []);

  return (
    <div>
      Landing Page (real) - you are signed out
      <h2>Events</h2>
      <ul>
        {events.map((event) => (
          <EventJoinable key={event.id} event={event} account={account} setAccount={setAccount} />
        ))}
      </ul>
      <h2>User Details</h2>
      <ul>
        <li>Name: {account.name}</li>
        <li>Email: {account.email}</li>
      </ul>
      <EditName account={account} setAccount={setAccount} />
    </div>
  );
};

export default LandingSignedInPage;
