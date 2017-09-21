var snoowrap = require('snoowrap');

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    var r = new snoowrap({
        user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.91 Safari/537.36",
        client_id: process.env["ClientId"],
        client_secret: process.env["ClientSecret"],
        username: process.env["Username"],
        password: process.env["Password"]
      });

      var result = [];
      var me = "";
      //var result = r.getSubreddit('snoowrap').getHot()
      //var result = r.getMe();
      if (req.query.name || (req.body && req.body.name)) {
        context.res = {

            // status: 200, /* Defaults to 200 */
            body: "Hello " + (req.query.name || req.body.name)
        };
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string or in the request body"
        };
    }
    //   r.getMe().then(function(m) { 
    //       me = m
    //     });
    //     me = r.getSubmission('2np694').body;
};