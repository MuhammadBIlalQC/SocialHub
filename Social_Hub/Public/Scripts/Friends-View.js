class Friend extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = { user: this.props.user };
        this.style = {
            'border': 'black 1px solid',
            'margin': '20px',
            'padding': '20px',
            'display': 'inlineBlock',
        }
    }

    render()
    {
        return (
            <div style={this.style}>
                <h3>{this.props.user} <span className="text-muted"> is friends with you!</span></h3>
            </div>
            )
    }
}

class FriendRequest extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = { user: this.props.user, acceptionView: [] };
        this.style = {
            'border': 'black 1px solid',
            'margin': '20px',
            'display': 'inlineBlock',
            'position': 'relative',
            'height': '120px',
            'overflow': 'none',
            'width': '400px',
        }
        this.acceptFriendRequest = this.acceptFriendRequest.bind(this);
        this.removeFriendRequest = this.removeFriendRequest.bind(this);
    }

    acceptFriendRequest()
    {
        $.post('/api/friend/acceptFriendRequest', { friendRequestUsername: this.props.user }, function (data) {
            //to do;
        });

        $('.' + this.props.user + 'buttons').fadeOut();
        $('.' + this.props.user + 'outtext').text('You two are now Friends!');
    }

    removeFriendRequest()
    {
        $('.' + this.props.user + 'friendrequest').fadeOut();
    }
    render()
    {
        return (
            <div style={this.style} className={this.props.user + 'friendrequest' + ' col-md-3' }>
                <img style={{ height: '100%', position: 'absolute', left: '0px', }} src="/UserImages/placeholder.png" />
                <div style={{ position: 'absolute', top: '10px', 'right': '5px', }}>
                    <p>{this.props.user} <span className="text-muted"> sent you a friend request!</span></p>
                    <button className={"glyphicon glyphicon-ok btn btn-primary " + this.props.user + 'buttons'} style={{ width: '60px', margin: '5px' }} onClick={this.acceptFriendRequest} ></button>
                    <button style={{ width: '60px', margin: '5px' }} className={"glyphicon glyphicon-remove btn btn-primary " + this.props.user + 'buttons'} onClick={this.removeFriendRequest}></button>
                    <p className={this.props.user + 'outtext'} ></p>
                </div>
            </div>
            )
    }
}

class FriendsAddables extends React.Component {
    constructor(props) {
        super(props);
        this.state = { user: this.props.user, acceptionView: [], buttonClickText: 'Add Friend', buttonClickClass: 'btn btn-primary' };
        this.style = {
            'border': 'black 1px solid',
            'margin': '20px',
            'display': 'inlineBlock',
            'position': 'relative',
            'height': '120px',
            'overflow': 'none',
            'width': '400px',
        }
        this.addFriend = this.addFriend.bind(this);

        this.buttonClickText = this.buttonClickText.bind(this);
    }

    buttonClickText(e)
    {
        this.setState({ buttonClickText: 'Friend Request Sent!', buttonClickClass: 'btn btn-success' });
    }
    addFriend() {
        $.post('/api/friend/sendFriendRequest', { friendRequestUsername: this.props.user }, function (data) {

        });

        this.buttonClickText();
    }
    render() {
        return (
            <div style={this.style} className={this.props.user + 'friendsAddables ' + ' col-md-3'}>
                <img style={{ height: '100%', position: 'absolute', left: '0px', }} src="/UserImages/placeholder.png" />
                <div style={{ position: 'absolute', bottom: '0px', right: '0px', marginRight: '20px', height: '100%', textAlign: 'right', lineHeight: '5px', }}>
                    <h3 style={{  }}>{this.props.user}</h3> <br />
                    <button style={{}} onClick={this.addFriend} className={this.state.buttonClickClass} onClick={this.addFriend}>
                        {this.state.buttonClickText}
                    </button>
                </div>
            </div>
        )
    }
}

class FriendsView extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = { friends: [], friendRequests: [], friendables: [] };
        const self = this;
        $.get('/api/friend/getfriends', function (data) {
            var friends = [];
            for (var i = 0; i < data.length; i++)
                friends.push(<Friend user={data[i]} />);
            /* Temperory Disable of Showing Friends in Find Friends */
            /*self.setState({ friends: friends }); */
        });

        $.get('/api/friend/getfriendrequests', function (data) {
            var friendRequests = [];
            for (var i = 0; i < data.length; i++)
                friendRequests.push(<FriendRequest user={data[i]} />);
            self.setState({ friendRequests: friendRequests });
        });

        $.get('/api/friend/allpossiblefriends', function (data) {
            var friendables = [];
            for (var i = 0; i < data.length; i++)
                friendables.push(<FriendsAddables user={data[i]} offset={i % 3 == 0 ? true : false} />);
            self.setState({ friendables: friendables });
        });
    }

    render()
    {
        return (
            <div>
                <div className="row">
                    {this.state.friends}
                </div>
                <div className="row">
                    {this.state.friendRequests.length == 0 ? null : <div> <h1>Friend Requests</h1> {this.state.friendRequests} </div>}
                </div>
                <div className="row">
                    {this.state.friendables.length == 0 ? null : <div> <h1>Add New Friends</h1> {this.state.friendables} </div>}
                </div>
            </div>
        )
    }
}

ReactDOM.render(<FriendsView />, document.getElementById('FriendsView'));