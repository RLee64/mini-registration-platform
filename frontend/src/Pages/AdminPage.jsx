import { useState, useEffect } from "react";
import { useAtomValue } from "jotai";
import Collapsible from "react-collapsible";

import platformApi from "../services/platform-api";
import { accessTokenAtom } from "../atoms";

import Account from "../components/Account";
import EventAreaAdmin from "../components/EventAreaAdmin";
import CompetitionAreaAdmin from "../components/CompetitionAreaAdmin";

const AdminPage = () => {
  const accessToken = useAtomValue(accessTokenAtom);

  const [events, setEvents] = useState([]);
  const [competitions, setCompetitions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [questions, setQuestions] = useState([]);

  const flexBoxWrapper = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: "0 20px",
    padding: "0 10px",
  };

  const triggerStyle = {
    fontSize: 26,
    backgroundColor: "rgba(101, 99, 144, 0.2)",
    padding: 10,
    borderBottom: "2px solid rgba(24, 19, 48, 0.51)",
    marginTop: 15,
  };

  const transitionTime = 200;

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

  useEffect(() => {
    platformApi.getCompetitions(accessToken).then((receivedCompetitions) => {
      setCompetitions(receivedCompetitions);
    });
  }, [questions]); // Competition GET request is called every time a question is added to keep the questionId fields up to date

  useEffect(() => {
    platformApi.getQuestions(accessToken).then((receivedQuestions) => {
      setQuestions(receivedQuestions);
    });
  }, []);

  return (
    <div>
      <h1>Admin Panel</h1>
      <Collapsible
        trigger="Events"
        triggerStyle={triggerStyle}
        transitionTime={transitionTime}
      >
        <EventAreaAdmin
          events={events}
          setEvents={setEvents}
          competitions={competitions}
        />
      </Collapsible>
      <Collapsible
        trigger="Competitions"
        triggerStyle={triggerStyle}
        transitionTime={transitionTime}
      >
        <CompetitionAreaAdmin
          competitions={competitions}
          setCompetitions={setCompetitions}
          questions={questions}
          setQuestions={setQuestions}
        />
      </Collapsible>
      <Collapsible
        trigger="Accounts"
        triggerStyle={triggerStyle}
        transitionTime={transitionTime}
      >
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
