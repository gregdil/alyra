import React from 'react';

export default class Proposals extends React.Component {

    addProposal = async () => {
        let proposalDescription = document.getElementById("addProposalButton").value;
        if (typeof proposalDescription === 'string' && proposalDescription !== ""){
            await this.props.contract.methods.addProposal(proposalDescription).send({ from: this.props.accounts[0] });
            await this.props.onProposalChange();
            document.getElementById('addProposalButton').value = "";
        }
        window.location.reload();
    };

    voteForProposal = async (_i) => {
        if(this.props.hasVoted === false){
            await this.props.contract.methods.setVote(_i).send({ from: this.props.accounts[0] });
        }
        window.location.reload();
    };

    proposalsTable () {
        if (this.props.proposalList.length > 0) {
            return <div>
                        <div className="col-lg-12">
                            <h3>Liste des proposals</h3>
                        </div>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">Id</th>
                                    <th scope="col">Proposal</th>
                                    {this.props.workflowStatus === '3'  ? <th scope="col">Action</th> : ""}
                                </tr>
                            </thead>
                            <tbody>
                                {this.props.proposalList.map((prop,i) => (
                                    <tr key={i}>  
                                        <th scope="row">{i}</th>
                                        <td>{prop.description}</td>
                                        {this.props.workflowStatus === '3' && this.props.hasVoted === false  ?  <td><button className="btn btn-primary" onClick={() => this.voteForProposal(i)}>Vote Now</button></td> : this.props.hasVoted === true ? <td>deja vote</td> : ""}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
        }else{
            return <div className="row">
                        <div className="col-lg-12">
                            <h3>Liste des proposals</h3>
                        </div>
                        <div className="alert alert-info" role="alert">Aucun Proposale enregistrer</div>
                    </div> 
        }
    }


    

    propsalAdd() {
        if (this.props.isVoter) {
            if (this.props.workflowStatus === '1') {
                return <div className="row">
                        <div className="col-lg-12">
                            <h3>Ajout de proposal</h3>
                        </div>
                        <div className="col-lg-12">
                            <div className="form-group">
                                <input type="text" id="addProposalButton" className="form-control" placeholder="proposal" />
                            </div><br />
                            <button onClick={this.addProposal} className="btn btn-primary">Ajouter</button>        
                        </div>
                    </div>
            } else{
                return <div className="row">
                            <div className="alert alert-info" role="alert">Ajout des proposition fermé</div>
                        </div>
            }
        }else{
            return <div className="row">
                        <div className="col-lg-12">
                            <h3>Ajout de proposal</h3>
                        </div>
                        <div className="alert alert-info" role="alert">Vous n'etes pas enregistrer pour ajouter un porposal</div>
                    </div> 
        }
    }


    render(){
        return(
            <div className="container-sm" id='proposal'>
                <div className="col-lg-12">
                    <h1 className='display-5 fw-bold'>Proposal</h1>
                    <hr className="text-success border-2 opacity-50"></hr>
                </div>
                { this.propsalAdd() }<br />
                { this.proposalsTable() }
            </div>
        )
    }
}