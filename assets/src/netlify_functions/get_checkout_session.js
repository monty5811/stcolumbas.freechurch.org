const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type"
};

exports.handler = function(event, context, callback) {
  if (event.httpMethod === "HEAD") {
    callback(null, { statusCode: 200, headers, body: JSON.stringify(null) });
  }
  if (event.httpMethod === "OPTIONS") {
    callback(null, { statusCode: 200, headers, body: JSON.stringify(null) });
  }
  if (event.httpMethod !== "POST" || !event.body) {
    callback(null, {
      statusCode: 400,
      headers,
      body: JSON.stringify({ status: "bad-payload" })
    });
  }
  //-- Parse the body contents into an object.
  const data = JSON.parse(event.body);

  //-- Make sure we have all required data. Otherwise, escape.
  if (!data.amount || !data.description) {
    console.error("Required information is missing.");

    callback(null, {
      statusCode: 400,
      headers,
      body: JSON.stringify({ status: "missing-information" })
    });

    return;
  }

  stripe.checkout.sessions.create(
    {
      success_url: "https://stcolumbas.freechurch.org/connect/giving-success",
      cancel_url: "https://stcolumbas.freechurch.org/connect/giving-cancel",
      payment_method_types: ["card"],
      billing_address_collection: "required",
      payment_method_types: ["card"],
      submit_type: "donate",
      line_items: [
        {
          name: data.description,
          amount: data.amount,
          currency: "gbp",
          quantity: 1
        }
      ]
    },
    function(err, session) {
      // asynchronously called
      if (err !== null) {
        console.log(err);
        callback(null, {
          statusCode: 200,
          headers,
          body: JSON.stringify({ status: "session-create-failed" })
        });
      }

      callback(null, {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: "session-created",
          sessionId: session.id
        })
      });
    }
  );
};
