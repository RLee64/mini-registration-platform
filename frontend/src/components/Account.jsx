const Account = ({ account, events }) => {
  const accountStyle = {
    width: "21%",
    minWidth: 300,
  };

  const bottomPadding = {
    paddingBottom: 20,
  };

  return (
    <li className="item" style={accountStyle}>
      <h3>{account.name}</h3>
      <p>
        <strong>Email:</strong> {account.email}
      </p>
      {account.joinedEvents?.length > 0 ? (
        <div style={bottomPadding}>
          <p>
            <strong>Joined Events:</strong>
          </p>
          <ul>
            {account.joinedEvents.map((eventName) => (
              <li key={eventName}>- {eventName}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No events joined</p>
      )}
    </li>
  );
};

export default Account;
