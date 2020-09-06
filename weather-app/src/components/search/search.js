import React from 'react';
import './search.css';
export default class Search extends React.Component {
    render() {
        return (
            <div className="group">
                <h1>Weather App | ReactJS</h1>
                <form onSubmit={this.props.submit}>
                    <span className="material-icons">location_on</span>
                    <input type="text" placeholder="Enter your location here" value={this.props.val} onChange={this.props.change} />
                </form>
            </div>
        );
    }
}