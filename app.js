const express = require("express");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded());

const port = process.env.PORT || 80;
// const apiKey = process.env.API_KEY;

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;

  const memberData = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonMemberData = JSON.stringify(memberData);

  // URL
  // https://us21.api.mailchimp.com/3.0/lists/{list_id}

  const url = "https://us21.api.mailchimp.com/3.0/lists/313255e752";

  const options = {
    method: "POST",
    auth: "key1:16e47b4b33926b83d7858653e65d5bdc-us21",
  };

  const apiRequest = https.request(url, options, (apiResponse) => {
    console.log("statusCode:", apiResponse.statusCode);
    console.log("headers:", apiResponse.headers);

    if (apiResponse.statusCode == "200") {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    apiResponse.on("data", (d) => {
      //process.stdout.write(d);
      const jsonData = JSON.parse(d);
      console.log(jsonData);
    });
  });

  apiRequest.on("error", (e) => {
    console.error(e);
  });

  apiRequest.write(jsonMemberData);

  apiRequest.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(port, function () {
  console.log("App listen on port 3001");
});
