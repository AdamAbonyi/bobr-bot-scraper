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


    var subreddit = null;
    if (!!req.body) subreddit = req.body.subreddit;
    if (!subreddit && !!req.query) subreddit = req.query.subreddit;

    if (!subreddit) {
        context.res = {
            status: 400,
            body: "Please pass a subreddit name on the query string or in the request body"
        };
    }

    function checkForEmbeded(item) {
        if (!!item["secure_media"]  && !!item["secure_media"]["oembed"] && !!item["secure_media"]["oembed"].html) {
            var str = item["secure_media"]["oembed"].html;

            var regex = /<iframe.*?src=['"](.*?)['"]/;
            var src = regex.exec(str)[1];

            return src;
        }

        return null;
    }

    function checkForPicture(item) {
        if (!!item["preview"]  && !!item["preview"]["images"] && !!item["preview"]["images"][0] && !!item["preview"]["images"][0].source && !!item["preview"]["images"][0].source.url) {
            return item["preview"]["images"][0].source.url;
        }

        return null;
    }

    r.getSubreddit(subreddit).getHot().then((x) => {
        if (!!x && x.length > 0 && !!subreddit) {
            let first = x.find(x => !x.stickied && !x.pinned && (!!checkForEmbeded(x) || checkForPicture(x)) );
            let result = checkForEmbeded(first);
            if (!result) result = checkForPicture(first);
            context.res = {
                // status: 200, /* Defaults to 200 */
                body: JSON.stringify(result)
            };
        }
        context.done();
    });
};