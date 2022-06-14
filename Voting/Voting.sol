// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.14;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Voting is Ownable{
   
    enum WorkflowStatus {RegisteringVoters,ProposalsRegistrationStarted,ProposalsRegistrationEnded,VotingSessionStarted,VotingSessionEnded,VotesTallied}

    bool public AddProposalIsActive = false;
    bool public AddVoteIsActive = false;


    struct Proposal {
      string description;
      uint voteCount;
    }

    struct Voter {
      bool isRegistered;
      bool hasVoted;
      uint votedProposalId;
    }

    Proposal[] private proposals;
    Voter[] private Voters;


    mapping(address => bool) private _whitelist;
    mapping(address => bool) private _electeurs;

    event Whitelisted(address _address);
    event ProposalRegistered(uint proposalId);
    event Voted (address voter, uint proposalId);
    event VoterRegistered(address voterAddress); 
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);

    function whitelist(address _address) public onlyOwner {
      require(!_whitelist[_address], "This address is already whitelisted !");
      _whitelist[_address] = true;
      emit Whitelisted(_address);
    }

    function setProposalIsActive(bool _isActive) public onlyOwner {
            AddProposalIsActive = _isActive;
    }

     function setVoteIsActive(bool _isActive) public onlyOwner {
            AddVoteIsActive = _isActive;
    }

    function RemoveVote(address _address) public onlyOwner {
            delete _electeurs[_address];
    }

    function addProposal(string memory _description,address _address) public {
        require(_whitelist[_address], "Whitelist: You need to be whitelisted");
        require(AddProposalIsActive == true, "Proposal is not active");
        proposals.push(Proposal(_description,0));
        uint proposalId = proposals.length -1;
        emit ProposalRegistered(proposalId);
    }

    function SetVoted(uint proposalId, address _address) public {
        require(_whitelist[_address], "Whitelist: You need to be whitelisted");
        require(AddVoteIsActive == true, "Vote is not active");
        require(!_electeurs[_address], "You have already voted");
        Voters.push(Voter(true,true,proposalId));
        _electeurs[_address] = true;
        emit Voted (_address, proposalId);
        emit VoterRegistered(_address);
        proposals[proposalId].voteCount += 1;
    }

    function getWinner() public view returns(uint){
        require(AddVoteIsActive == false, "Vote is  active");
        require(AddProposalIsActive == false, "Proposal is  active");
        uint256 largest = 0; 
        uint256 i;
        uint winningProposalId;

        for(i = 0; i < proposals.length; i++){
            if(proposals[i].voteCount > largest) {
                largest = proposals[i].voteCount; 
                winningProposalId = i;
            } 
        }
        return winningProposalId;
    }

    function getProposalsById(uint proposalId) public view returns(Proposal memory) {
      return proposals[proposalId];
    }
    
    function getProposals() public view returns(Proposal[] memory) {
        return proposals;
    }
}