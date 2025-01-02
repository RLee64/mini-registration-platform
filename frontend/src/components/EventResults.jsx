import { useState } from "react";
import { useAtomValue } from "jotai";

import platformApi from "../services/platform-api";
import { accessTokenAtom } from "../atoms";

const EventResults = ({ event }) => {
  const accessToken = useAtomValue(accessTokenAtom);

  const [eventData, setEventData] = useState(null);

  const headingStyle = {
    borderTop: "2px solid rgba(63, 66, 75, 0.68)",
    paddingTop: 20,
  };

  const buttonStyle = {
    marginTop: 10,
    marginBottom: 20,
  };

  const getResults = () => {
    platformApi
      .getResults(event.name, accessToken)
      .then((returnedData) => {
        setEventData(returnedData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (!eventData) {
    return (
      <button onClick={getResults} style={buttonStyle}>
        Results
      </button>
    );
  }

  return (
    <div>
      <h3 style={headingStyle}>Results</h3>
      {Object.keys(eventData.results).length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(eventData.results).map((email) => (
              <tr key={email}>
                <td>{email}</td>
                <td>
                  {eventData.results[email]}/{eventData.totalQuestions}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No Data</p>
      )}
    </div>
  );
};

export default EventResults;
