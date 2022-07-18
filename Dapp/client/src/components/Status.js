import React from 'react';

export default class Status extends React.Component {

    checkWorkFlowStatus(status) {
        switch (status) {
            case '0' :
                return <div>Enregistrement des voters</div>;
            case '1' :
                return <div>Début Session des proposal</div>;
            case '2' :
                return <div>Fin Session des proposal</div>;
            case '3' :
                return <div>Ouverture session de vote</div>;
            case '4' :
                return <div>Fin de session de vote</div>;
            case '5' :
                return <div>Resultats des votes ouvert <a href='#Winner'>Voir</a></div>;
            default:
                return <div>Aucun Status</div>;
        }
    }

    changeStatus() {
        if (this.props.isOwner) {
            if (this.props.workflowStatus === '0') {
                //if(this.props.voter.length > 0){
                    return <div>
                        <button className="btn btn-primary" onClick={this.startProposalsRegistering}>Start proposals registering</button>
                    </div>
                //}else{
                  //  return <div><div className="alert alert-warning" role="alert">Ajouter des voters pour pouvoir commencer</div></div>
                //}
            }
            if (this.props.workflowStatus === '1') {
                return <div>
                    <button className="btn btn-primary" onClick={this.endProposalsRegistering}>End proposals registering</button>
                </div>
            }
            if (this.props.workflowStatus === '2') {
                return <div>
                    <button className="btn btn-primary" onClick={this.startVotingSession}>Start voting session</button>
                </div>
            }
            if (this.props.workflowStatus === '3') {
                return <div>
                    <button className="btn btn-primary" onClick={this.endVotingSession}>End voting session</button>
                </div>
            }
            if (this.props.workflowStatus === '4') {
                return <div>
                    <button className="btn btn-primary" onClick={this.tallyVotes}>Tally votes</button>
                </div>
            }
        }
    }

    startProposalsRegistering = async () => {
        await this.props.contract.methods.startProposalsRegistering().send({ from: this.props.accounts[0] });
        this.props.onWorkflowChange()
    };

    endProposalsRegistering = async () => {
        await this.props.contract.methods.endProposalsRegistering().send({ from: this.props.accounts[0] });
        this.props.onWorkflowChange()
    };

    startVotingSession = async () => {
        await this.props.contract.methods.startVotingSession().send({ from: this.props.accounts[0] });
        this.props.onWorkflowChange()
    };

    endVotingSession = async () => {
        await this.props.contract.methods.endVotingSession().send({ from: this.props.accounts[0] });
        this.props.onWorkflowChange()
    };

    tallyVotes = async () => {
        await this.props.contract.methods.tallyVotes().send({ from: this.props.accounts[0] });
        this.props.onWorkflowChange()
    };


    render(){
        return(
            <div className="container-sm" id='status'>
                 <div className="row">
                    <div className="col-lg-12">
                        <h1 className='display-5 fw-bold'>Vos information</h1>
                        <hr className="text-success border-2 opacity-50"></hr>
                    </div>
                    
                </div>
                <div className="row">
                    <div className="col-4">
                        {this.props.isVoter ? <div className="alert alert-success" role="alert">Vous etes bien inscrit</div> : <div className="alert alert-danger" role="alert">Vous n'êtes pas encore enregistrer</div>}
                    </div>
                    <div className="col-4">
                        <div className="alert alert-success" role="alert">{this.checkWorkFlowStatus(this.props.workflowStatus)} </div>
                    </div>
                    <div className="col-4">
                        {this.changeStatus()}
                    </div>
                </div>
            </div>
        )
    }
}