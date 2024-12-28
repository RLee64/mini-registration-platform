const SmallMessage = ({ message, type }) => {
  const msgStyle = {
    backgroundColor:
      type === "error"
        ? "#b50000" // red
        : "#1dd153", // green
    padding: 7,
    fontSize: 14,
    borderRadius: 5,
    boxSizing: "border-box",
    width: "100%",
    marginBottom: 10,
  };

  return message ? <p style={msgStyle}>{message}</p> : null;
};

export default SmallMessage;
