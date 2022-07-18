import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/dashboard.css";
import VotingContract from "./contracts/Voting.json";
import getWeb3 from "./getWeb3";


import Header from "./components/Header.js";
import Link from "./components/Link";
import Voters from "./components/Voters";
import Proposals from "./components/Proposals";
import Status from "./components/Status";
import Result from "./components/Result";



class App extends Component {
    state = {
        web3: null,
        accounts: null,
        contract: null,
        workflowStatus: null,
        isOwner: null,
        isVoter: null,
        Voter: [],
        proposalList: [],
        proposalCount: 0,
        hasVoted : false,
        proposalWinnerId: -1
    };

    Owner = '0x8CD38C60eB6b1Ad8878E78D088eD8561EA607728';

    componentDidMount = async () => {
        try {
            await this.initWeb3();
            await this.updateWorkflowStatus();
            await this.updateRoles();
            await this.updateVoters();
            await this.updateRoles();
            await this.updateProposalList();
            await this.updateIfIsVote();
            

        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };

    initWeb3 = async () => {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();

        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = VotingContract.networks[networkId];
        const contract = new web3.eth.Contract(
            VotingContract.abi,
            deployedNetwork && deployedNetwork.address,
        );

        this.setState({ web3, accounts, contract });
    };

    updateWorkflowStatus = async () => {
        const workflowStatus = await this.state.contract.methods.workflowStatus().call({ from: this.state.accounts[0] });
        this.setState({ workflowStatus });
        if (workflowStatus === '5') {
            await this.GetWinner();
        }
    };

    updateIfIsVote = async () => {
        if(this.state.isVoter === true){
            const value = await this.state.contract.methods.getVoter(this.state.accounts[0]).call({ from: this.state.accounts[0] });
            const hasVoted = value.hasVoted;
            this.setState({ hasVoted });
        }
    };

    GetWinner = async () => {
        if(this.state.isVoter){
            const winnerId = await this.state.contract.methods.winningProposalID().call({ from: this.state.accounts[0] });
            const proposalWinnerId = await this.state.contract.methods.getOneProposal(winnerId).call({ from: this.state.accounts[0] });
            this.setState({ proposalWinnerId });
        }
    };

  

    updateVoters= async () => {
        console.log("fdddf");
        console.log(this.state.isOwner);
        if(this.state.isOwner === true){
            let voterEventsList = await this.state.contract.getPastEvents('VoterRegistered', {fromBlock: 0,toBlock: 'latest'});
            console.log("eth1 UpadteVoters ");
            console.log(voterEventsList);
            const Voter = [];
            voterEventsList.map( (voter) => (
                Voter.push(voter.returnValues.voterAddress.toString())
            ));
            this.setState({ Voter });
        }
    };

    updateRoles = async () => {
        const isOwner = (this.state.accounts[0] === this.Owner);
        console.log(isOwner);
        console.log(this.state.accounts[0] + " => "+ this.Owner);
        this.setState({ isOwner });
        const isVoter = this.state.Voter.includes(this.state.accounts[0]);
        console.log(this.state.accounts[0] + " => " + isVoter)
        this.setState({ isVoter });
    };

    updateProposalList = async () => {
        console.log("ETH1 updateProposalList");
        console.log("ISVoter : " + this.state.isVoter);
        if (this.state.isVoter) {
            let proposalEventsList = await this.state.contract.getPastEvents('ProposalRegistered', {fromBlock: 0,toBlock: 'latest'});
            let proposalCount = proposalEventsList.length;
            this.setState({ proposalCount });
            const proposalList = [];
            for (let i = 0; i < this.state.proposalCount; i++) {
                const result = await this.state.contract.methods.getOneProposal(i).call({from: this.state.accounts[0]});
                proposalList.push(result);
            }
            this.setState({ proposalList });
        }
    };

    render() {
        if (!this.state.web3) {
            return <div>Loading Web3, accounts, and contract...</div>;
        }
        return (
            <div className="App" id="home">
                <Header address={this.state.accounts}/>
                <Link></Link>
                <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                <Status
                    address={this.state.accounts}
                    web3={this.state.web3}
                    isVoter={this.state.isVoter}
                    isOwner={this.state.isOwner}
                    workflowStatus={this.state.workflowStatus}
                    accounts={this.state.accounts}
                    contract={this.state.contract}
                    onWorkflowChange={this.updateWorkflowStatus}
                    voter={this.state.Voter}
                />
                <Voters
                    workflowStatus={this.state.workflowStatus}
                    accounts={this.state.accounts}
                    contract={this.state.contract}
                    isOwner={this.state.isOwner}
                    isVoter={this.state.isVoter}
                    voter={this.state.Voter}
                    listChange={this.updateVoters}
                />
                <Proposals
                    workflowStatus={this.state.workflowStatus}
                    accounts={this.state.accounts}
                    contract={this.state.contract}
                    isVoter={this.state.isVoter}
                    proposalList={this.state.proposalList}
                    onProposalChange={this.updateProposalList}
                    hasVoted={this.state.hasVoted}
                    
                />
                <Result
                    proposalWinnerId={this.state.proposalWinnerId}>

                </Result>
                </main>
            </div>
        );
    }
}

export default App;
