class ChatHead extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = { showBody: false, messages: [], lastFetched: null};
        var right = 0;
        if (this.props.nthChild != null)
            right = this.props.nthChild * 205;
        this.style = {
            width: '200px',
            position: 'fixed',
            bottom: '0px',
            right: right+'px',
            marginRight: '5px',
            zIndex: '50',
        }

        this.buttonStyle = {
            width: '100%',
            height: '100%',
            borderRadius: '0px',
        }
        this.bodyStyle = {
            height: '300px',
            width: '200px',
            border: '1px solid black',
        }
        this.textInputStyle = {
            width: '80%',
            height: '30px',
            margin: '0px',
            position: 'absolute',
            bottom: '0px',
        }
        this.sendButtonStyle = {
            width: '20%',
            height: '30px',
            margin: '0px',
            position: 'absolute',
            fontSize: '8px',
            bottom: '0px',
            right: '0px',
        }
        this.textAreaStyle = {
            height: '270px',
            width: '100%',
            overflowY: 'scroll',
            backgroundColor: 'rgba(255,255,255,1)'
        }

        this.toggleChat = this.toggleChat.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.loadMessages = this.loadMessages.bind(this);
        this.inputKeyEnter = this.inputKeyEnter.bind(this);

        this.loadMessages();

        /*
        const d1 = new Date();
        const d2 = new Date();
        if (d1 < d2)
            console.log('true'); */
    }

    toggleChat()
    {
        const showBody = this.state.showBody;
        this.setState({ showBody: !showBody });

    }

    loadMessages()
    {
        const self = this;
        $.post('/api/friend/getmesssages', { friend: this.props.user }, function (data) {
            const messages = self.state.messages != null ? self.state.messages : [];
            const dates = [];
            if (data != null || data.length != 0)
            {
                data.forEach(message => {
                    const pushMessagetoChat = self.state.lastFetched == null ? true : message.date > self.state.lastFetched;
                    if (pushMessagetoChat)
                    {
                        var user = message.srcUser;
                        user = user == self.props.user ? user : 'you';
                        messages.push(<p>{user}: {message.text}</p>);
                        dates.push(message.date);
                    }
                });
                self.setState({ messages: messages, lastFetched: data[data.length - 1].date });
            }
        });

        setTimeout(this.loadMessages, 500);
    }

    inputKeyEnter(e)
    {
        if (e.keyCode == 13)
            this.sendMessage();
    }
    sendMessage()
    {
        const text = $('#textInputChat-' + this.props.user).val();
        if (text != '')
        {
            $('#textInputChat-' + this.props.user).val('');
            const messages = this.state.messages;
            /* this.loadMessage() takes care of posting message into the chatbox
            messages.push(<p>you: {text}</p>);
            this.setState({ messages: messages });
            */

            $.post('/api/friend/postmessage', { friend: this.props.user, message: text }, function (data) {
                // to do on error
            });
        }

    }
    render()
    {
        return (
            <div style={this.style}>
                <button style={this.buttonStyle} className="btn btn-primary" onClick={this.toggleChat} >{this.props.user != null ? this.props.user : 'Error'} </button>
                {this.state.showBody == false ? null :
                    <div style={this.bodyStyle}>
                    <div id="textOutputChat" style={this.textAreaStyle}>
                        {this.state.messages}
                    </div>
                    <input id={"textInputChat-" + this.props.user} type="text" style={this.textInputStyle} onKeyDown={this.inputKeyEnter} />
                    <button style={this.sendButtonStyle} className="btn btn-primary" onClick={this.sendMessage}>Send</button>
                </div> }
            </div>
            
            )
    }
}

class ChatsView extends React.Component {
    constructor(props)
    {
        super(props);
        this.chats = this.props.chatsLoaded;
        this.chatHeads = [];
    }

    render()
    {

        for (var i = 0; i < this.chats.length; i++) {
            this.chatHeads.push(<ChatHead user={this.chats[i]} nthChild={i + 1} />);
        }
        return <div>{this.chatHeads}</div>
    }
}

class FriendPanel extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = { friends: [], chatsLoaded: [] };
        const self = this;

        this.openChat = this.openChat.bind(this);

        $.get('/api/friend/getfriends', function (data) {
            const friends = [];
            for (var i = 0; i < data.length; i++)
            {
                friends.push(data[i])
            }
            self.setState({ friends: friends });
        });


    }

    openChat(e)
    {
        const chatsLoaded = this.state.chatsLoaded;
        const friend = (e.target.innerText);
        if (!chatsLoaded.find(username => username == friend)) {
            chatsLoaded.push(friend);
            this.setState({ chatsLoaded: chatsLoaded });
        }
    }

    render()
    {
        return (
        <div>
            <div className="container">
                <div className="col-sm-3 col-md-2 sidebar">
                    <ul className="nav nav-sidebar">
                     <li className="active"><a href="#">Welcome! <span className="sr-only">(current)</span></a></li>
                    </ul>
                    <ul className="nav nav-sidebar">
                            <li className="active"><a href="#">Friends<span className="sr-only">(current)</span></a></li>
                            {this.state.friends.map(friendName => <li><a href="#" onClick={this.openChat} > { friendName }</a></li>)}
                    </ul>
                    <ul className="nav nav-sidebar">
                        <li><a href="">Nav item again</a></li>
                        <li><a href="">One more nav</a></li>
                        <li><a href="">Another nav item</a></li>
                    </ul>
                </div>
                <ChatsView chatsLoaded={this.state.chatsLoaded}/>
            </div>
        </div>)
    }
}


ReactDOM.render(<FriendPanel />, document.getElementById('friendPanel'));