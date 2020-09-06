import React from 'react';
import './goback.css'
import { Link } from "react-router-dom";
export default class GoBackButton extends React.Component {
    render() {
        return (
            <div class="btnContainer">
                <Link to="/"><button className="goback">Go back</button></Link>
            </div>
        )
    }
}