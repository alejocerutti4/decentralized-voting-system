import React, { useEffect, useState } from 'react';
import vote from '../img/vote.svg';

const Connected = (props) => {
  const [remainingTime, setRemainingTime] = useState('');
  const [selectedCandidateIndex, setSelectedCandidateIndex] = useState(-1);

  const handleCheckboxChange = (index) => {
    setSelectedCandidateIndex(index);
  };

  const handleVote = () => {
    if (selectedCandidateIndex !== -1) {
      props.vote(selectedCandidateIndex);
    } else {
      alert('Please select a candidate before voting.');
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance =
        props?.votationEndDate && props?.votationEndDate?.getTime() - now;

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

      setRemainingTime(
        `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [props.votationEndDate]);

  return props.loading ? (
    <div className='h-screen flex flex-col items-center w-screen justify-center'>
      {props.loading && (
        <span class='loading loading-infinity loading-lg'></span>
      )}
    </div>
  ) : (
    <div
      className='flex flex-col h-screen w-screen justify-center'
      onClick={() => handleCheckboxChange(-1)}
    >
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col justify-center items-center text-2xl gap-6'>
          <img src={vote} alt='ethereum' className='w-96 justify-center' />
        </div>

        <div className='mx-auto justify-items-center align-middle m-4'>
          <p className='text-2xl font-thin'>
            The votation will end on{' '}
            <span className='font-bold'>
              {props.votationEndDate &&
                props.votationEndDate.toLocaleDateString()}
            </span>{' '}
            at{' '}
            <span className='font-bold'>
              {props.votationEndDate &&
                props.votationEndDate.toLocaleTimeString()}
            </span>
          </p>
        </div>

        <div className='mx-auto justify-items-center align-middle'>
          <p className='text-2xl font-thin'>{remainingTime}</p>
        </div>

        <div className='flex flex-row justify-center items-center gap-4'>
          {props.hasVoted && (
            <p className='font-bold'>You have already voted</p>
          )}
        </div>
        <div className='flex flex-row items-center justify-center'>
          <div className='divider w-1/2 items-center align-middle'></div>
        </div>

        <div className='flex flex-row items-center justify-center'>
          <div className='w-1/2'>
            <table className='table'>
              <thead className='text-center'>
                <tr>
                  <th className=''>Select</th>
                  <th className=''>Candidate</th>
                  <th className=''>Votes</th>
                </tr>
              </thead>
              <tbody className='text-center'>
                {props.candidates.map((candidate, index) => (
                  <tr key={index}>
                    <th>
                      <label>
                        <input
                          type='checkbox'
                          class='checkbox border-accent'
                          checked={selectedCandidateIndex === index}
                          disabled={props.hasVoted}
                          onChange={() => handleCheckboxChange(index)}
                        />
                      </label>
                    </th>
                    <td className='items-center'>{candidate.name}</td>
                    <td>{candidate.voteCount.toString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className='flex flex-row items-center justify-center'>
          <button
            className='btn btn-accent btn-lg shadow-md'
            onClick={() => handleVote(selectedCandidateIndex)}
            disabled={props.hasVoted || selectedCandidateIndex === -1}
          >
            Vote
          </button>
        </div>
      </div>
    </div>
  );
};

export default Connected;
