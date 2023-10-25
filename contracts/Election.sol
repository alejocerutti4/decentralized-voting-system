// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Election {
    address public owner;
    uint256 public electionStartTime;
    uint256 public electionEndTime;
    bool public electionStarted; 
    
    struct Candidate {
        string name;
        uint256 voteCount;
    }
    
    mapping(address => bool) public voters;
    Candidate[] public candidates;

    event CandidateAdded(string name);
    event Voted(address voter, string candidateName);

    constructor() {
        owner = msg.sender;
        electionStarted = false;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    modifier onlyDuringElection() {
        require(electionStarted, "Election has not started yet");
        require(block.timestamp >= electionStartTime && block.timestamp <= electionEndTime, "Voting is only allowed during the election period");
        _;
    }

    modifier beforeElectionStarted() {
        require(!electionStarted, "Election has already started");
        _;
    }

    function startElection(uint256 durationMinutes) public onlyOwner beforeElectionStarted {
        electionStarted = true;
        electionStartTime = block.timestamp;
        electionEndTime = electionStartTime + (durationMinutes * 1 minutes);
    }

    function addCandidate(string memory name) public onlyOwner beforeElectionStarted {
        candidates.push(Candidate(name, 0));
        emit CandidateAdded(name);
    }

    function vote(uint256 candidateIndex) public onlyDuringElection {
        require(candidateIndex < candidates.length, "Invalid candidate index");
        require(!voters[msg.sender], "You have already voted");

        candidates[candidateIndex].voteCount++;
        voters[msg.sender] = true;

        emit Voted(msg.sender, candidates[candidateIndex].name);
    }

    function getCandidateCount() public view returns (uint256) {
        return candidates.length;
    }

    function getCandidate(uint256 index) public view returns (string memory name, uint256 voteCount) {
        require(index < candidates.length, "Invalid candidate index");
        return (candidates[index].name, candidates[index].voteCount);
    }

    function getAllCandidates() public view returns (Candidate[] memory) {
        return candidates;
    }

    function getElectionStartTime() public view returns (uint256) {
        return electionStartTime;
    }

    function getElectionEndTime() public view returns (uint256) {
        return electionEndTime;
    }
}