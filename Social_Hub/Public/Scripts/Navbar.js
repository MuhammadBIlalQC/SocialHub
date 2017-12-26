

class Nav extends React.Component {
    render() {
        return (
            <nav className="navbar navbar-inverse navbar-fixed-top " style={{'backgroundColor': '#00b0ff'}}>
                <div className="container-fluid">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                            <span class="sr-only">Toggle navigation</span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                        </button>
                        <a className="navbar-brand" href="#" style={{ 'color': 'white' }}>Social Hub</a>
                    </div>

                    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                        <ul className="nav navbar-nav">
                            <li><a href="/">News Feed</a></li>
                            <li><a href="/friends">Find Friends</a></li>
                            <li><a href="#">Another Feature</a></li>
                        </ul>
                        <ul className="nav navbar-nav navbar-right">
                            <li><a href="#">Settings</a></li>
                            <li><a href="/account/signout">Log Out</a></li>
                        </ul>
                    </div>
                </div>
            </nav>)
    }
}

ReactDOM.render(<Nav />, document.getElementById('navbar'));