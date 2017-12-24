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
            'padding': '20px',
            'display': 'inlineBlock',
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
            <div style={this.style} className={this.props.user + 'friendrequest'}>
                <h3>{this.props.user} <span className="text-muted"> sent you a friend request!</span></h3>
                <button className={"glyphicon glyphicon-ok btn btn-primary " + this.props.user + 'buttons'} style={{ width: '60px', margin: '5px' }} onClick={this.acceptFriendRequest} ></button>
                <button style={{ width: '60px', margin: '5px' }} className={"glyphicon glyphicon-remove btn btn-primary " + this.props.user + 'buttons'} onClick={this.removeFriendRequest}></button>
                <p className={this.props.user + 'outtext'} ></p>
            </div>
            )
    }
}

class FriendsAddables extends React.Component {
    constructor(props) {
        super(props);
        this.state = { user: this.props.user, acceptionView: [] };
        this.style = {
            'border': 'black 1px solid',
            'margin': '20px',
            'padding': '20px',
            'display': 'inlineBlock',
        }
        this.addFriend = this.addFriend.bind(this);
    }

    addFriend() {
        $.post('/api/friend/sendFriendRequest', { friendRequestUsername: this.props.user }, function (data) {

        });

        $('.' + this.props.user + 'friendsAddables-buttons').fadeOut();
        $('.' + this.props.user + 'friendsAddables-outtext').text('Friend Request Sent!');
        console.log('clicked add friend');
    }
    render() {
        return (
            <div style={this.style} className={this.props.user + 'friendsAddables'}>
                <h3>{this.props.user}</h3>
                <button style={{ width: '60px', margin: '5px' }} className={"glyphicon glyphicon-plus btn btn-primary " + this.props.user + 'friendsAddables-buttons'} onClick={this.addFriend}></button>
                <p className={this.props.user + 'friendsAddables-outtext'} ></p>
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
            self.setState({ friends: friends });
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
                friendables.push(<FriendsAddables user={data[i]} />);
            self.setState({ friendables: friendables });
        });
    }

    render()
    {
        return (
            <div>
                <h1>Friends</h1>
                {this.state.friends}
                {this.state.friendRequests}
                <h1>Add New Friends!</h1>
                {this.state.friendables}
            </div>
        )
    }
}

ReactDOM.render(<FriendsView />, document.getElementById('FriendsView'));