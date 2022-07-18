import React from 'react';

export default class Link extends React.Component {
    render(){
        return( 

            <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
                <div className="position-sticky pt-3">
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <a href="#home" className="nav-link active">Home</a>
                        </li>
                        <li className="nav-item">
                            <a href="#status" className="nav-link ">Status</a>
                        </li>
                        <li className="nav-item">
                            <a href="#Voters" className="nav-link ">Voters</a>
                        </li>
                        <li className="nav-item">
                            <a href="#proposal" className="nav-link ">Proposal</a>   
                        </li>
                        <li className="nav-item">
                            <a href="#Winner" className="nav-link ">Winner</a>   
                        </li>
                    </ul>
                </div>
            </nav>
        );
    } 
}

