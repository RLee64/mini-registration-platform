const Message = ({ message, type }) => {
  const msgStyle = {
    backgroundColor:
      type === "error"
        ? "#b50000" // red
        : "#1dd153", // green
    padding: 10,
    borderRadius: 10,
    boxSizing: "border-box",
    width: "100%",
    marginBottom: 30,
  };

  return message ? <p style={msgStyle}>{message}</p> : null;
};

export default Message;
