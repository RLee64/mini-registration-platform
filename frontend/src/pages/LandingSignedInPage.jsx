import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";

import platformApi from "../services/platform-api";
import { accessTokenAtom } from "../atoms";
import EditName from "../components/EditName";
import EventJoinable from "../components/EventJoinable"

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
