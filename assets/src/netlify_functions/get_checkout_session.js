const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type"
};

exports.handler = async function(event, context) {
  if (event.httpMethod === "HEAD" || event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: JSON.stringify(null) };
  }

  if (event.httpMethod !== "POST" || !event.body) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ status: "bad-payload" })
    };
  }

  //-- Parse the body contents into an object.
  const data = JSON.parse(event.body);

  //-- Make sure we have all required data. Otherwise, escape.
  if (!data.amount || !data.description) {
    console.error("Required information is missing.");

    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ status: "missing-information" })
    };
  }

  try {
    const session = await stripe.checkout.sessions.create({
      success_url: "https://stcolumbas.freechurch.org/connect/giving-success",
      cancel_url: "https://stcolumbas.freechurch.org/connect/giving-cancel",
      payment_method_types: ["card"],
      billing_address_collection: "required",
      submit_type: "donate",
      line_items: [
        {
          name: data.description,
          amount: Math.round(data.amount),
          currency: "gbp",
          quantity: 1
        }
      ]
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: "session-created",
        sessionId: session.id
      })
    };
  } catch (err) {
    console.log(err);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ status: "session-create-failed" })
    };
  }
};
