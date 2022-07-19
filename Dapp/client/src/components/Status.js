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
                        <div className="d-flex align-items-center p-3 my-3 text-white rounded shadow-sm" style={{backgroundColor:"#6f42c1"}}>
                            <div className="lh-1">
                                <h1 className="h6 mb-0 text-white lh-1">Dapp Voting</h1>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-8">
                        <div className="my-3 p-3 bg-body rounded shadow-sm">
                            <h6 className="border-bottom pb-2 mb-0">Vos information</h6>
                            <div className=" text-muted pt-3">
                                <p className="pb-3 mb-0 small lh-sm border-bottom">
                                    <strong className="d-block text-gray-dark">Votre Adresse : </strong>
                                    {this.props.address}
                                </p>
                            </div>
                            <div className="text-muted pt-3">
                                <p className="pb-3 mb-0 small lh-sm border-bottom">
                                    <strong className="d-block text-gray-dark">Votre status :</strong>
                                    {this.props.isVoter ? <div className='text-error'>Vous etes bien inscrit au systeme de vote</div> : <div className='text-error'>Vous n'êtes pas encore enregistrer </div>}
                                </p>
                            </div>

                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="my-3 p-3 bg-body rounded shadow-sm">
                            <h6 className="border-bottom pb-2 mb-0">Statut du Systeme</h6>
                            <div className=" text-muted pt-3">
                                <p className="pb-3 mb-0 small lh-sm border-bottom">
                                    <strong className="d-block text-gray-dark">Statut Actuel : </strong>
                                    {this.checkWorkFlowStatus(this.props.workflowStatus)}
                                </p>
                            </div>
                            <div className="text-muted pt-3 text-center">
                                <p className="pb-3 mb-0 small lh-sm border-bottom">
                                    {this.changeStatus()}
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}