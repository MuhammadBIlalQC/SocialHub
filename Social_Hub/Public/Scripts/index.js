  class AnnouncementPost extends React.Component {

    constructor(props) {
        super(props);
        this.textAreaStyle = {
            'width': '800px',
            'height': '200px',
            'marginTop': '40px'
        };
    } // end of constructor()

    render() {
      return (
        <div>
         <textarea id="AnnouncementPost" className="post" style={ this.textAreaStyle }
            placeholder="Post an Anouncement..."></textarea><br/>
          <input className="btn btn-primary post-submit" type="button" value="Post" onClick={this.props.click} />
        </div>
            )
    }

  }

  class Announcement extends React.Component {
    constructor(props) {
      super(props);
      this.getDate = this.getDate.bind(this);
      this.state = { date: this.getDate() };
      this.style = {
          'width': '800px',
          'minHeight': '200px',
          //'border': '1px solid gray',
          'padding': '10px',
          'marginTop': '20px',
          'boxShadow': '0px 4px 10px 0px rgba(0,0,0,0.2)',
      };
    }

    getDate() {
      if (!this.props.date)
          return 'Just Now';
      const date = this.props.date;
      return  '' + date.Month + '/' + date.Day + '/' + date.Year + ' ' + date.Hour + ':' + (date.Minutes < 10 ? '0' : '') + date.Minutes  +' am/pm';

    } 

    render() {
      return (
          <div className="announcement" style={this.style}>
            <h3 className="prompter"><i>{this.props.user} ({this.state.date}) </i></h3> <br />
            <p style={{ 'paddingLeft': '20px' }} className="prompter-msg">{this.props.msg}</p>
        </div>
      )
    } 
  } 

  class Content extends React.Component {

    constructor(props){
        super(props);
        this.state = {Announcements: [], user: '', childrenID: 0};
        const self = this;

        $.get('/api/user/getusername', function (data) {
            self.setState({ user: data.user });
        });

        $.get('/api/user/getannouncements', function (data) {
            if (data != null)
            {
                var fetchedAnnouncements = [];
                console.log(data.length);
                for (var i = 0; i < data.length; i++)
                {
                    fetchedAnnouncements.push(<Announcement user={data[i].username} msg={data[i].text} />);
                }
                console.log(fetchedAnnouncements);
                self.setState({ Announcements: fetchedAnnouncements });
            }
        });

        this.postAnnouncement = this.postAnnouncement.bind(this);
    } 

    postAnnouncement() {
        const AnnouncementPost = document.getElementById('AnnouncementPost');
        const userMessage = AnnouncementPost.value;
        if (userMessage != "")
        {
            AnnouncementPost.value = "";
            const childID = this.state.childrenID + 1;
            const posts = this.state.Announcements;
            $.post('/api/user/postannouncement', { text: userMessage }, function (data) {
                console.log('posted data');
            });
            posts.unshift(<Announcement user={this.state.user} msg={userMessage} key={childID} />);
            console.log(posts);
            this.setState({ Announcements: posts, childrenID: childID });
        }
        
    } 

    render() {
        return (
            <div>
                <AnnouncementPost click={this.postAnnouncement} />
                <div>
                    {this.state.Announcements}
                </div>
           </div>
      )
    }
  }

  ReactDOM.render(<Content />, document.getElementById('post-content'));
