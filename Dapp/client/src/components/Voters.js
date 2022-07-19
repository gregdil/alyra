import React from 'react';

export default class Voters extends React.Component {

    addVoter = async () => {
        let voterAddress = document.getElementById("addVoterButton").value;
        // TODO check if voterAddress is correct format
        await this.props.contract.methods.addVoter(voterAddress).send({ from: this.props.accounts[0] });
        await this.props.listChange();
        document.getElementById('addVoterButton').value = "";
        window.location.reload();
    };


    voterAdd(){
        if(this.props.isOwner === true) {
            if (this.props.workflowStatus === '0') {
                return <div className="row">
                            <div className="col-lg-12">
                                <h3>Ajouter des Voters :</h3>
                            </div>
                            <div className="col-lg-12">
                                <div className="form-group">
                                    <input type="text" id="addVoterButton" className="form-control" placeholder="Address" />
                                </div><br />
                                <button onClick={this.addVoter} className="btn btn-primary">Ajouter</button>
                            </div>
                        </div>
            }else{
                return <div className="row">
                    <div className="alert alert-info" role="alert">Inscritption des voteurs fermé</div>
                </div>
            }
        }
    }

    voterList() {
        if(this.props.isOwner === true) {
            if(this.props.voter.length > 0){
                return <div className="row">
                    <div className="col-lg-12">
                        <h3>Liste des Voters</h3>
                    </div>
                    <div className="col-lg-12">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">Id</th>
                                    <th scope="col">Address</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.props.voter.map((a,i) => (
                                    <tr key={a}>
                                        <th scope="row">{i}</th>
                                        <td>{a}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            }else{
                return <div className="row">
                            <div className="col-lg-12">
                                <h3>Liste des Voters</h3>
                            </div>
                            <div className="alert alert-info" role="alert">Il n'y a aucun incrit</div>
                        </div>
            }
        }
    }


    render(){
        return(
            <div className="container-sm" id='Voters'>
                <div className="col-lg-12">
                    <h1 className='display-5 fw-bold'>Voters</h1>
                    <hr className="text-success border-2 opacity-50"></hr>
                </div>
                {this.voterAdd()}<br />
                {this.voterList()}                
            </div>
        )
    }
}