const ErrorMessage = ({message}) => {
  const errorStyling = {
    backgroundColor: "#b50000",
    padding: 10,
    borderRadius: 10,
    boxSizing: "border-box",
    width: "100%",
    marginBottom: 30
  };

  return message ? <p style={errorStyling}>{message}</p> : null;
};

export default ErrorMessage