const snoowrap = require('snoowrap');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    // Initialize Reddit API connector
    var r = new snoowrap({
        user_agent: "Azure Functions automatic downloader v0.1 (by /u/Xenik )",
        client_id: process.env["ClientId"],
        client_secret: process.env["ClientSecret"],
        username: "xenik",
        password: process.env["Password"]
    });

    // Default Error Message
    context.res = {
        status: 400,
        body: "Please pass a subreddit name on the query string or in the request body"
    }; 

    // Check if subreddit is filled in
    var subreddit = null;
    if (!!req.body) subreddit = req.body.subreddit;
    if (!subreddit && !!req.query) subreddit = req.query.subreddit;

    if (!subreddit) {
        context.res = {
            status: 400,
            body: "Please pass a subreddit name on the query string or in the request body"
        };
        //context.done();
        return;
    }

    // Helper function 1
    function checkForEmbeded(item) {
        if (!!item["secure_media"]  && !!item["secure_media"]["oembed"] && !!item["secure_media"]["oembed"].html) {
            var str = item["secure_media"]["oembed"].html;

            var regex = /<iframe.*?src=['"](.*?)['"]/;
            var src = regex.exec(str)[1];

            return src;
        }
        return null;
    }

    // Helper function 2
    function checkForPicture(item) {
        if (!!item["preview"]  && !!item["preview"]["images"] && !!item["preview"]["images"][0] && !!item["preview"]["images"][0].source && !!item["preview"]["images"][0].source.url) {
            return item["preview"]["images"][0].source.url;
        }
        return null;
    }

    // Retrieve data
    var results = await r.getSubreddit(subreddit).getHot();

    if (!!results && results.length > 0 && !!subreddit) {
        let contentResults = results.filter(x => !x.stickied && !x.pinned && (!!checkForEmbeded(x) || checkForPicture(x)));
        let resultLength = contentResults.length;

        if (!resultLength) {
            context.res = {
                status: 400, /* Defaults to 200 */
                body: "No image contant found"
            };    
        }

        // Pick a random result
        var randomIndex = Math.floor(Math.random() * (contentResults.length - 0 + 1)) + 0;
        let item = contentResults[randomIndex];
        
        // Extract links to content
        let result = checkForEmbeded(item);
        if (!result) result = checkForPicture(item);
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: JSON.stringify(result)
        };
    }
    //context.done();
};