const snoowrap = require('snoowrap');

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    var r = new snoowrap({
        user_agent: "Azure Functions automatic downloader v0.1 (by /u/Xenik )",
        client_id: process.env["ClientId"],
        client_secret: process.env["ClientSecret"],
        username: "xenik",
        password: process.env["Password"]
    });

    context.res = {
        status: 400,
        body: "Please pass a subreddit name on the query string or in the request body"
    }; 

    if (!(req.body && req.body.subreddit)) {
        context.res = {
            status: 400,
            body: "Please pass a subreddit name on the query string or in the request body"
        };
    }

    r.getSubreddit('gifs').getHot().then((x) => {
        if (!!x && x.length > 0 && (req.body && req.body.subreddit)) {
            let first = x.find(x => !x.stickied && !x.pinned);
            context.res = {
                // status: 200, /* Defaults to 200 */
                body: JSON.stringify(first.body || x[0])
            };
        }
        context.done();
    });


    //var result = r.getMe();
    // if (req.query.name || (req.body && req.body.name)) {
    //     context.res = {

    //         // status: 200, /* Defaults to 200 */
    //         body: "Hello " + (req.query.name || req.body.name)
    //     };
    // }
    // else {
    //     context.res = {
    //         status: 400,
    //         body: "APlease pass a name on the query string or in the request body"
    //     };
    // }
    //context.done();

};