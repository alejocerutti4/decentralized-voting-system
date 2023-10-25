import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { contractAbi, contractAddress } from './Constant/constant';
import Connected from './Components/Connected';
import { LiaVoteYeaSolid } from 'react-icons/lia';
import { FaEthereum } from 'react-icons/fa';

function App() {
  const [account, setAccount] = useState('');
  const [votationEndDate, setVotationEndDate] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [number, setNumber] = useState('');
  const [canVote, setCanVote] = useState(true);
  const [contract, setContract] = useState(null);
  const [etherscanURL, setEtherscanURL] = useState('');
  const [hasElectionStarted, setHasElectionStarted] = useState(false)
  const [loading, setLoading] = useState(true);

  const fetchContractData = useCallback(async () => {
    try {
      setLoading(true);
      const votationEndDate = await contract.electionEndTime();
      // votationEndDate is BigNumber {_hex: '0x651b1408', _isBigNumber: true}
      const votationTimestamp = parseInt(votationEndDate._hex, 16);
      const now = new Date(votationTimestamp * 1000);
      setVotationEndDate(now);
      const getCandidates = await contract.getAllCandidates();
      setCandidates(getCandidates);
      const electionStarted = await contract.electionStarted();  
      setHasElectionStarted(electionStarted);
      const hasVoted = await contract.voters(account);
      setEtherscanURL(
        `https://sepolia.etherscan.io/address/${contractAddress}`
      );
      setCanVote(hasVoted);
      setLoading(false);
    } catch {}
  }, [contract, account]);

  useEffect(() => {
    const connectToMetaMask = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          setLoading(true);
          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
          });
          const currentAccount = accounts[0];
          setAccount(currentAccount);
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const contractInstance = new ethers.Contract(
            contractAddress,
            contractAbi,
            signer
          );

          setContract(contractInstance);
          await fetchContractData();
        } catch (error) {
          console.error(error);
        }
      } else {
        console.error('Metamask is not detected in the browser');
      }
    };
    connectToMetaMask();    
  }, []);

  useEffect(() => {
    if (contract && account) {
      // Aseguramos que contract y account están establecidos
      fetchContractData();
    }
  }, [contract, account, fetchContractData]);

  const vote = async (index) => {
    try {
      const tx = await contract.vote(index);
      await tx.wait();
      setCanVote(false);
      await fetchContractData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleNumberChange = (e) => {
    setNumber(e.target.value);
  };

  const handleLogout = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_requestPermissions',
        params: [
          {
            eth_accounts: {},
          },
        ],
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main>
      <header className='py-3 px-10 flex items-center fixed top-0 w-full justify-between z-40 text-white'>
        <div className='flex flex-row gap-4 items-center'>
          <div className='flex flex-row items-center'>
            <LiaVoteYeaSolid className='text-5xl' />
          </div>

          <div className='flex flex-row items-center'>
            <a
              href={etherscanURL}
              className='text-2xl flex flex-row items-center gap-2 btn-accent btn-md rounded-btn'
            >
              Contract
              <FaEthereum className='text-2xl' />
            </a>
          </div>
        </div>
        <div></div>
        <div className='flex flex-row gap-4 items-center'>
          <p>
            Your account:{' '}
            <span className='font-thin text-sm italic opacity-50 '>
              {account}
            </span>
          </p>
          <button className='btn btn-accent btn-md' onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <Connected
        account={account}
        etherscanURL={etherscanURL}
        candidates={candidates}
        votationEndDate={votationEndDate}
        number={number}
        handleNumberChange={handleNumberChange}
        vote={vote}
        handleLogout={handleLogout}
        hasVoted={canVote}
        loading={loading}
        electionStarted={hasElectionStarted}
      />
    </main>
  );
}

export default App;
