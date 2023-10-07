import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { contractAbi, contractAddress } from './Constant/constant';
import Connected from './Components/Connected';
import './App.css';

function App() {
  const [account, setAccount] = useState('');
  const [votationEndDate, setVotationEndDate] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [number, setNumber] = useState('');
  const [canVote, setCanVote] = useState(true);
  const [contract, setContract] = useState(null);

  const fetchContractData = useCallback(async () => {
    try {
      const votationEndDate = await contract.electionEndTime();
      // votationEndDate is BigNumber {_hex: '0x651b1408', _isBigNumber: true}
      const votationTimestamp = parseInt(votationEndDate._hex, 16);
      const now = new Date(votationTimestamp * 1000);
      setVotationEndDate(now);
      const getCandidates = await contract.getAllCandidates();
      setCandidates(getCandidates);
      console.log('candidates', candidates);

      const hasVoted = await contract.voters(account);
      setCanVote(hasVoted);
    } catch {}
  }, [contract, account]);

  useEffect(() => {
    const connectToMetaMask = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
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
    <div className='App'>
      <Connected
        account={account}
        candidates={candidates}
        votationEndDate={votationEndDate}
        number={number}
        handleNumberChange={handleNumberChange}
        vote={vote}
        handleLogout={handleLogout}
        hasVoted={canVote}
      />
    </div>
  );
}

export default App;
