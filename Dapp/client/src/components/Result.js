import React from 'react';

export default class Result extends React.Component {

    checkWinner = () => {
        if(this.props.proposalWinnerId.length > 0){
            return <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">Id</th>
                            <th scope="col">description</th>
                            <th scope="col">VoteCount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{this.props.proposalWinnerId[1]}</td>
                            <td>{this.props.proposalWinnerId["description"]}</td>
                            <td>{this.props.proposalWinnerId["voteCount"]}</td>
                        </tr>
                    </tbody>
                </table>
        }
    }

    render(){
        return(
            <div className="container-sm" id='Winner'>
                 <div className="col-lg-12">
                    <h1 className='display-5 fw-bold'>Winner</h1>
                    <hr className="text-success border-2 opacity-50"></hr>
                </div>
                {this.checkWinner()}
            </div>
        )
    }
} 