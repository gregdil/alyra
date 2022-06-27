const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const Voting = artifacts.require('Voting');
contract('Voting', function (accounts) {
    const owner = accounts[0];
    const Voter1 = accounts[1];

    let VotingInstance;

    describe("TEST PROPOSAL",function(){
        beforeEach(async function () {
            VotingInstance = await Voting.new({from:owner});
            await VotingInstance.addVoter(owner, {from: owner});
            await VotingInstance.addVoter(Voter1, {from: owner});
        });

        it("REVERT ADD PROPOSAL IS NOT OPEN", async function(){
            await expectRevert(VotingInstance.addProposal("TEST", {from: Voter1}),"Proposals are not allowed yet");  
        });

        it("REVERT ADD PROPOSAL EMPTY", async function(){
            await VotingInstance.startProposalsRegistering({from: owner});
            await expectRevert(VotingInstance.addProposal("", {from: Voter1}),"Vous ne pouvez pas ne rien proposer");  
        });

        it("TEST ADD PROPOSAL expectEvent", async function(){
            await VotingInstance.startProposalsRegistering({from: owner});
            const receiptaddProposal = await VotingInstance.addProposal("proposal_1", {from: Voter1});
            expectEvent(receiptaddProposal,"ProposalRegistered",{proposalId: new BN (0)});
        });

        it("TEST getOneProposal Reponse", async function(){
            await VotingInstance.startProposalsRegistering({from: owner});
            await VotingInstance.addProposal("proposal_1", {from: Voter1});
            const GetonePropo = await VotingInstance.getOneProposal(0, {from: Voter1});
            expect(GetonePropo.description).to.equal("proposal_1");
        });

        it("TEST addProposal ExcepRevert End Proposal Registering", async function(){
            await VotingInstance.startProposalsRegistering({from: owner});
            await VotingInstance.endProposalsRegistering({from: owner});
            await expectRevert(VotingInstance.addProposal("TEST", {from: Voter1}),"Proposals are not allowed yet");  
        });

    });


    describe("TEST Voter",function(){
        beforeEach(async function () {
            VotingInstance = await Voting.new({from:owner});
        });

        it('ExceptRevert addVoter  Not open RegisteringVoters', async function (){
            await VotingInstance.startProposalsRegistering({from: owner});
            await expectRevert(VotingInstance.addVoter(Voter1, {from: owner}),'Voters registration is not open yet');  
        });

        it('expectRevert addVoter IS REGISTERED', async function (){
            await VotingInstance.addVoter(owner, {from: owner});
            await expectRevert(VotingInstance.addVoter(owner, {from: owner}),'Already registered');
        });

        it('expectEvent addVoter', async function (){
            const receiptaddVoter = await VotingInstance.addVoter(owner, {from: owner});
            expectEvent(receiptaddVoter,"VoterRegistered",{voterAddress: owner});
        });

        it('Test ADD VOTER AND TEST IS OK', async function (){
            await VotingInstance.addVoter(owner, {from: owner});
            await VotingInstance.addVoter(Voter1, {from: owner});
            let isregistered = await VotingInstance.getVoter(Voter1, {from: owner});  
            expect(isregistered.isRegistered).to.be.true;
        });

        it('Test setVote session not open', async function (){
            await VotingInstance.addVoter(Voter1, {from: owner});
            await expectRevert(VotingInstance.setVote(0, {from: Voter1}),'Voting session havent started yet');  
        });

        it('Test startVotingSession proposals phase is not finished', async function (){
            await VotingInstance.addVoter(Voter1, {from: owner});
            await expectRevert(VotingInstance.startVotingSession({from: owner}),'Registering proposals phase is not finished');
        });

        it('Test setVote Proposal not found ', async function (){
            await VotingInstance.addVoter(Voter1, {from: owner});
            await VotingInstance.startProposalsRegistering({from: owner});
            await VotingInstance.endProposalsRegistering({from: owner});
            await VotingInstance.startVotingSession({from: owner});
            await expectRevert(VotingInstance.setVote(0, {from: Voter1}),'Proposal not found');
        });

        it('Test setVote expectEvent', async function (){
            await VotingInstance.addVoter(Voter1, {from: owner});
            await VotingInstance.startProposalsRegistering({from: owner});
            await VotingInstance.addProposal("proposal_1", {from: Voter1});
            await VotingInstance.endProposalsRegistering({from: owner});
            await VotingInstance.startVotingSession({from: owner});
            const receiptSetVote = await VotingInstance.setVote(0, {from: Voter1});
            expectEvent(receiptSetVote,"Voted",{voter: Voter1, proposalId: new BN(0)});
        });

        it('Test setVote already voted', async function (){
            await VotingInstance.addVoter(Voter1, {from: owner});
            await VotingInstance.startProposalsRegistering({from: owner});
            await VotingInstance.addProposal("proposal_1", {from: Voter1});
            await VotingInstance.endProposalsRegistering({from: owner});
            await VotingInstance.startVotingSession({from: owner});
            const receiptSetVote = await VotingInstance.setVote(0, {from: Voter1});
            await expectRevert(VotingInstance.setVote(0, {from: Voter1}),'You have already voted');
        });

    });

    describe("Test tallyVotes",function(){


        describe("Test tallyVotes expectRevert",function(){
            beforeEach(async function () {
                VotingInstance = await Voting.new({from:owner});
            });
            it('REVERT tallyVotes Session de votes pas terminé', async function (){
                await expectRevert(VotingInstance.tallyVotes({from: owner}),"Current status is not voting session ended");  
            });
        });

        
        beforeEach(async function () {
            VotingInstance = await Voting.new({from:owner});
            await VotingInstance.addVoter(owner, {from: owner});
            await VotingInstance.addVoter(Voter1, {from: owner});
            await VotingInstance.startProposalsRegistering({from: owner});
            await VotingInstance.addProposal("proposal_1", {from: Voter1});
            await VotingInstance.endProposalsRegistering({from: owner});
            await VotingInstance.startVotingSession({from: owner});
            await VotingInstance.setVote(0,{from:owner});
            await VotingInstance.setVote(0,{from:Voter1});
            await VotingInstance.endVotingSession({from:owner});
        });
        
        it ('Test Avoir proposition Gagnante', async function (){
            const TallyVoteReturn = await VotingInstance.tallyVotes ({from:owner});
            expect(new BN(TallyVoteReturn.winningProposalID)).to.be.bignumber.equal(new BN(0));
        });

        it ('expectEvent Avoir proposition Gagnante', async function (){
            const TallyVoteReturn = await VotingInstance.tallyVotes ({from:owner});
            expectEvent(TallyVoteReturn,"WorkflowStatusChange",{previousStatus: new BN(4), newStatus: new BN(5)});
        });
    });





    describe("Verfication REVERT Exception Only",function(){

        beforeEach(async function () {
            VotingInstance = await Voting.new({from:owner}); 
        });

        
        it('REVERT getVoter onlyVoters', async function (){
            await expectRevert(VotingInstance.getVoter(Voter1, {from: owner}),"You're not a voter");  
        });

        it('REVERT getOneProposal onlyVoters', async function (){
            await expectRevert(VotingInstance.getOneProposal(1, {from: owner}),"You're not a voter");  
        });

        it('REVERT addProposal onlyVoters', async function (){
            await expectRevert(VotingInstance.addProposal("TEST", {from: owner}),"You're not a voter");  
        });

        it('REVERT setVote onlyVoters', async function (){
            await expectRevert(VotingInstance.setVote(1, {from: owner}),"You're not a voter");  
        });

        it('REVERT addVoter onlyOwner', async function (){
            await expectRevert(VotingInstance.addVoter(Voter1, {from: Voter1}),"Ownable: caller is not the owner");  
        });

        it('REVERT startProposalsRegistering onlyOwner', async function (){
            await expectRevert(VotingInstance.startProposalsRegistering({from: Voter1}),"Ownable: caller is not the owner");  
        });

        it('REVERT endProposalsRegistering onlyOwner', async function (){
            await expectRevert(VotingInstance.endProposalsRegistering({from: Voter1}),"Ownable: caller is not the owner");  
        });

        it('REVERT startVotingSession onlyOwner', async function (){
            await expectRevert(VotingInstance.startVotingSession( {from: Voter1}),"Ownable: caller is not the owner");  
        });

        it('REVERT endVotingSession onlyOwner', async function (){
            await expectRevert(VotingInstance.endVotingSession({from: Voter1}),"Ownable: caller is not the owner");  
        });

        it('REVERT tallyVotes onlyOwner', async function (){
            await expectRevert(VotingInstance.tallyVotes( {from: Voter1}),"Ownable: caller is not the owner");  
        });

    });

    describe("Test WorkflowStatusChange",function(){
        beforeEach(async function () {
            VotingInstance = await Voting.new({from:owner}); 
        });

        it('WorkflowStatus startProposalsRegistering ExceptEvent', async function (){
            const WorkflowStatus = await VotingInstance.startProposalsRegistering ({from:owner});
            expectEvent(WorkflowStatus,"WorkflowStatusChange",{previousStatus: new BN(0), newStatus: new BN(1)});
        });

        it('WorkflowStatus endProposalsRegistering ExceptEvent', async function (){
            await VotingInstance.startProposalsRegistering ({from:owner})
            const WorkflowStatus = await VotingInstance.endProposalsRegistering ({from:owner});
            expectEvent(WorkflowStatus,"WorkflowStatusChange",{previousStatus: new BN(1), newStatus: new BN(2)});
        });

        it('WorkflowStatus startVotingSession ExceptEvent', async function (){
            await VotingInstance.startProposalsRegistering ({from:owner})
            await VotingInstance.endProposalsRegistering ({from:owner});
            const WorkflowStatus = await VotingInstance.startVotingSession ({from:owner});
            expectEvent(WorkflowStatus,"WorkflowStatusChange",{previousStatus: new BN(2), newStatus: new BN(3)});
        });

        it('WorkflowStatus endVotingSession ExceptEvent', async function (){
            await VotingInstance.startProposalsRegistering ({from:owner})
            await VotingInstance.endProposalsRegistering ({from:owner});
            await VotingInstance.startVotingSession ({from:owner});
            const WorkflowStatus = await VotingInstance.endVotingSession ({from:owner});
            expectEvent(WorkflowStatus,"WorkflowStatusChange",{previousStatus: new BN(3), newStatus: new BN(4)});
        });

        it('WorkflowStatus startProposalsRegistering expectRevert', async function (){
            await VotingInstance.startProposalsRegistering ({from:owner})
            await VotingInstance.endProposalsRegistering ({from:owner});
            await expectRevert(VotingInstance.startProposalsRegistering( {from: owner}),"Registering proposals cant be started now");  
        });

        it('WorkflowStatus endProposalsRegistering expectRevert', async function (){
            await expectRevert(VotingInstance.endProposalsRegistering( {from: owner}),"Registering proposals havent started yet");
        });

        it('WorkflowStatus startVotingSession expectRevert', async function (){
            await expectRevert(VotingInstance.startVotingSession( {from: owner}),"Registering proposals phase is not finished");
        });

        it('WorkflowStatus endVotingSession expectRevert', async function (){
            await expectRevert(VotingInstance.endVotingSession( {from: owner}),"Voting session havent started yet");
        });

       
    }); 

});
