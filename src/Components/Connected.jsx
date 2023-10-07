import React, { useEffect, useState } from 'react';

const Connected = (props) => {
  const [remainingTime, setRemainingTime] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = props.votationEndDate.getTime() - now;

      if (distance <= 0) {
        clearInterval(interval);
        setRemainingTime('Votación finalizada');
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setRemainingTime(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [props.votationEndDate]);

  return (
    <div className='connected-container'>
      <p>Metamask Address: {props.account}</p>

      <h2 className='connected-header'>Votación</h2>

      <p className='connected-account'>
        {remainingTime === 'Votacion finalizada'
          ? remainingTime
          : `Falta: ${remainingTime}`}
      </p>
      {props.hasVoted ?? (
        <p className='connected-account'>You have already voted</p>
      )}
      <p>
        Elige un candidato y pulsa en el botón "Vote" para emitir tu voto. Solo
        puedes votar una vez.
      </p>

      <table id='myTable' className='candidates-table'>
        <thead>
          <tr>
            <th></th>
            <th>Candidate</th>
            <th>Votes</th>
          </tr>
        </thead>
        <tbody>
          {props.candidates.map((candidate, index) => (
            <tr key={index}>
              <button
                disabled={props.hasVoted}
                onClick={() => props.vote(index)}
              >
                Vote
              </button>
              <td>{candidate.name}</td>
              <td>{candidate.voteCount.toString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <br></br>
      <button className='login-button' onClick={props.handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Connected;
