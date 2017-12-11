var mainRouter = require('../Routers/MainRouter');
var accountRouter = require('../Routers/AccountRouter');
var friendAPIRouter = require('../Routers/FriendAPIRouter');
var userAPIRouter = require('../Routers/UserAPIRouter');
var friendRouter = require('../Routers/FriendRouter');

function routerConfig(app)
{
    app.use('/', mainRouter);
    app.use('/friends', friendRouter);
    app.use('/account', accountRouter);

    app.use('/api/user', userAPIRouter);
    app.use('/api/friend', friendAPIRouter);
}

module.exports = routerConfig;