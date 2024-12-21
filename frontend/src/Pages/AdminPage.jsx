import { useState, useEffect } from "react";
import { useAtomValue } from "jotai";
import Collapsible from 'react-collapsible';

import platformApi from "../services/platform-api";
import { accessTokenAtom } from "../atoms";

import Account from "../components/Account";
import EventAreaAdmin from "../components/EventAreaAdmin";

const AdminPage = () => {
  const accessToken = useAtomValue(accessTokenAtom);

  const [events, setEvents] = useState([]);
  const [accounts, setAccounts] = useState([]);

  const flexBoxWrapper = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: "0 20px",
    padding: "0 10px"
  };

  const triggerStyle = {
    fontWeight: "bold",
    fontSize: 26,
    display: "block",
    width: "100%",
    backgroundColor: "rgba(101, 99, 144, 0.2)",
    padding: 10,
    boxSizing: "border-box",
    borderBottom: "2px solid rgba(24, 19, 48, 0.51)",
    cursor: "pointer",
    marginTop: 15
  }

  /*Currently events and accounts are only called for at the beginning,
  meaning refreshing is currently required to keep track of updates.
  Maybe a potential fix would be nice? But it's not necessary*/
  useEffect(() => {
    platformApi.getAccounts(accessToken).then((receivedAccounts) => {
      setAccounts(receivedAccounts);
    });
  }, []);

  useEffect(() => {
    platformApi.getEvents().then((receivedEvents) => {
      setEvents(receivedEvents);
    });
  }, []);

  return (
    <div>
      <h1>Admin Panel</h1>
      <Collapsible trigger="Events" triggerStyle={triggerStyle} transitionTime={200}>
      <EventAreaAdmin events={events} setEvents={setEvents} />
      </Collapsible>
      <Collapsible trigger="Accounts" triggerStyle={triggerStyle} transitionTime={200}>
        <ul style={flexBoxWrapper}>
          {accounts.map((account) => (
            <Account key={account.email} account={account} events={events} />
          ))}
        </ul>
      </Collapsible>
    </div>
  );
};

export default AdminPage;
