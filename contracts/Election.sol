// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Election {
    address public owner;
    uint256 public electionStartTime;
    uint256 public electionEndTime;
    
    struct Candidate {
        string name;
        uint256 voteCount;
    }
    
    mapping(address => bool) public voters;
    Candidate[] public candidates;

    event CandidateAdded(string name);
    event Voted(address voter, string candidateName);

    constructor(uint256 _durationMinutes) {
        owner = msg.sender;
        uint256 currentTime = block.timestamp;
        electionStartTime = currentTime;
        electionEndTime = currentTime + (_durationMinutes * 1 minutes);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    modifier onlyDuringElection() {
        require(block.timestamp >= electionStartTime && block.timestamp <= electionEndTime, "Voting is only allowed during the election period");
        _;
    }

    function addCandidate(string memory name) public onlyOwner onlyDuringElection {
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

    // Function to retrieve the election start time
    function getElectionStartTime() public view returns (uint256) {
        return electionStartTime;
    }

    // Function to retrieve the election end time
    function getElectionEndTime() public view returns (uint256) {
        return electionEndTime;
    }
}
