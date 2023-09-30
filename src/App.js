import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractAbi, contractAddress } from "./Constant/constant";
import Login from "./Components/Login";
import Connected from "./Components/Connected";
import "./App.css";

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [votationEndDate, setVotationEndDate] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [number, setNumber] = useState("");
  const [canVote, setCanVote] = useState(true);

  useEffect(() => {
    // Initialize provider and connect to MetaMask
    const initProvider = async () => {
      if (window.ethereum) {
        try {
          const ethProvider = new ethers.providers.Web3Provider(
            window.ethereum
          );
          await ethProvider.send("eth_requestAccounts", []);
          const signer = ethProvider.getSigner();
          const address = await signer.getAddress();

          // Store provider and account in state
          setProvider(ethProvider);
          setAccount(address);
          setIsConnected(true);
          canUserVote();
        } catch (error) {
          console.error(error);
        }
      } else {
        console.error("Metamask is not detected in the browser");
      }
    };

    initProvider(); // Initialize provider when component mounts
  }, []);

  useEffect(() => {
    connectToMetamask();
    getVotationEndDate();
    getCandidates();
    // Add an event listener for account changes
    const handleAccountChange = (newAccounts) => {
      if (newAccounts.length > 0) {
        // Handle the change in Ethereum account here
        const newAccount = newAccounts[0];
        setAccount(newAccount);
        canUserVote(); // You may want to refresh data when the account changes
      } else {
        // Handle the case when no accounts are available
        setAccount(null);
        setIsConnected(false);
      }
    };

    // Add an event listener for account changes
    window.ethereum.on("accountsChanged", handleAccountChange);

    // Cleanup the listener when the component unmounts
    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountChange);
    };
  }, []);

  useEffect(() => {
    if (account) {
      canUserVote();
    }
  }, [account]);
 
  async function vote() {
    try {
      if (provider && account) {
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(
          contractAddress,
          contractAbi,
          signer
        );

        const tx = await contractInstance.vote(number);
        await tx.wait();
        canUserVote();
      } else {
        console.error("Provider or account not initialized.");
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function canUserVote() {
    try {
      if (provider && account) {
        const contractInstance = new ethers.Contract(
          contractAddress,
          contractAbi,
          provider
        );
        const inVoters = await contractInstance.voters(account);
        setCanVote(inVoters);
      } else {
        console.error("Provider or account not initialized.");
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function getCandidates() {
    try {
      if (provider && account) {
        const contractInstance = new ethers.Contract(
          contractAddress,
          contractAbi,
          provider
        );
        const candidatesList = await contractInstance.getAllCandidates();
        const formattedCandidates = candidatesList.map((candidate, index) => {
          return {
            index: index,
            name: candidate.name,
            voteCount: candidate.voteCount.toNumber(),
          };
        });
        setCandidates(formattedCandidates);
      } else {
        console.error("Provider or account not initialized.");
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function getVotationEndDate() {
    try {
      if (provider && account) {
        const contractInstance = new ethers.Contract(
          contractAddress,
          contractAbi,
          provider
        );
        const endTime = await contractInstance.getElectionEndTime();
        const endTimeParsed = new Date(parseInt(endTime) * 1000);
        setVotationEndDate(endTimeParsed);
      } else {
        console.error("Provider or account not initialized.");
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function connectToMetamask() {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setProvider(provider);
        setAccount(address);
        setIsConnected(true);
        canUserVote();
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error("Metamask is not detected in the browser");
    }
  }

  function handleNumberChange(e) {
    setNumber(e.target.value);
  }

  function handleLogout() {
    setIsConnected(false);
    setAccount(null);
    setProvider(null);
  }

  return (
    <div className="App">
      {isConnected ? (
        <Connected
          account={account}
          candidates={candidates}
          votationEndDate={votationEndDate}
          number={number}
          handleNumberChange={handleNumberChange}
          voteFunction={vote}
          showButton={canVote}
          handleLogout={handleLogout}
        />
      ) : (
        <Login connectWallet={connectToMetamask} />
      )}
    </div>
  );
}

export default App;
