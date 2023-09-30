import React from "react";

const Connected = (props) => {
  const votationEndDate = props.votationEndDate;
  const dateOptions = { year: "numeric", month: "long", day: "numeric" };
  const timeOptions = { hour: "2-digit", minute: "2-digit" };

  return (
    props.votationEndDate && (
      <div className="connected-container">
        <h1 className="connected-header">Estás conectado a Metamask</h1>
        <button className="login-button" onClick={props.handleLogout}>
          Logout
        </button>
        <p className="connected-account">Metamask Address: {props.account}</p>
        {props.votationEndDate && (
          <p className="connected-account">
            La votación termina el {`${votationEndDate.toLocaleDateString(
              "es-ES",
              dateOptions
            )} ${votationEndDate.toLocaleTimeString("es-ES", timeOptions)}`}
          </p>
        )}
        {props.showButton ? (
          <p className="connected-account">You have already voted</p>
        ) : (
          <div>
            <input
              type="number"
              placeholder="Enter Candidate Index"
              value={props.number}
              onChange={props.handleNumberChange}
            ></input>
            <br />
            <button className="login-button" onClick={props.voteFunction}>
              Vote
            </button>
          </div>
        )}

        <table id="myTable" className="candidates-table">
          <thead>
            <tr>
              <th>Index</th>
              <th>Candidate name</th>
              <th>Candidate votes</th>
            </tr>
          </thead>
          <tbody>
            {props.candidates.map((candidate, index) => (
              <tr key={index}>
                <td>{candidate.index}</td>
                <td>{candidate.name}</td>
                <td>{candidate.voteCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  );
};

export default Connected;
