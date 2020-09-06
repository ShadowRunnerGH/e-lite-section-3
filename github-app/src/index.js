import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: null,
            submittedUsername: null,
            name: null,
            ghUsername: null,
            bio: null,
            profile: null,
            error: null,
            isError: false,
            isLoaded: false,
            isSubmitted: false,
            icon: null,
            repos: []
        }
    }
    handleChange = e => {
        e.preventDefault();
        this.setState({ username: e.target.value })
    }
    handleSubmit = e => {
        e.preventDefault();
        this.setState({ isError: false, isLoaded: false, isSubmitted: false, submittedUsername: this.state.username })
        if(this._input.value === "") {
            this.setState({isError: true, isLoaded: true, isSubmitted: true})
            return;
        }
        fetch(`https://api.github.com/users/${this.state.username}`)
            .then(res => res.json())
            .then(
                (result) => {
                    if (result.message === "Not Found") {
                        this.setState({
                            isLoaded: true,
                            isError: true,
                            isSubmitted: true,
                            error: result.message
                        })
                    } else {
                        this.setState({
                            isError: false,
                            icon: result.avatar_url,
                            bio: result.bio,
                            ghUsername: result.login,
                            isSubmitted: true,
                            name: result.name,
                            profile: result.html_url
                        });
                    }
                },
            )
            .catch(
                (error) => {
                    this.setState({
                        isLoaded: true,
                        isError: true,
                        isSubmitted: true,
                        error: error.message
                    })
                }
            )
        fetch(`https://api.github.com/users/${this.state.username}/repos?per_page=100`)
            .then(res => res.json())
            .then(
                (result) => {
                    if (result.message === "Not Found") {
                        this.setState({
                            isLoaded: true,
                            isError: true,
                            isSubmitted: true,
                            error: result.message
                        })
                    } else {
                        this.setState({
                            repos: result,
                            isLoaded: true,
                            isError: false,
                            isSubmitted: true   
                        });
                    }
                },
            )
            .catch(
                (error) => {
                    this.setState({
                        isLoaded: true,
                        isError: true,
                        isSubmitted: true,
                        error: error.message
                    })
                }
            )
        this._input.value = "";
        this.setState({username: null})
    }

    render() {
        const { name, submittedUsername, ghUsername, bio, profile, isLoaded, isError, isSubmitted, icon, repos } = this.state;
        console.log(this.state.data)
        return (
            <div className="main">
                <div className="search">
                    <form onSubmit={this.handleSubmit}>
                        <h1 className="mainHeader">Github API | React JS</h1>
                        <div className="group">
                            <span class='material-icons'>person</span>
                            <input ref={(el) => this._input = el} type="search" name="username" placeholder="GitHub Username" maxLength="39" onChange={this.handleChange} autoComplete="off" /><br />
                        </div>
                    </form>
                </div>
                {(!isError && isSubmitted && isLoaded ?
                    (<div className='userInfo'>
                        <img src={icon} alt=""></img>
                        <h3>{name}</h3>
                        <a href={profile} rel="noopener noreferrer" target="_blank">{ghUsername}</a>
                        <p>{bio}</p>
                    </div>) :
                    (<div></div>)
                )}
                {(isError && isLoaded? ( 
                    <div className="userInfoError">
                        <h3>User not found</h3>
                        <p>The github account @{submittedUsername} was not found. Please try again.</p>
                    </div>
                ) : (<div></div>))}
                {!isLoaded && isSubmitted ? (
                    <div className="loader">
                    </div>) :
                    (<div></div>)
                }
                {isLoaded && repos.map(repo => {
                    return (
                        <div className={(!isError ? 'repos' : 'reposHide')}>
                            <div className="header">
                                <h4>{repo.name}</h4>
                                <span className="link">
                                    <a href={repo.html_url} rel="noopener noreferrer" target="_blank">Visit</a>
                                </span>
                            </div>
                            <p>{repo.description}</p>
                        </div>
                    )
                })
                }
            </div>
        );
    }
}
ReactDOM.render(
    <Main />,
    document.getElementById('root')
)