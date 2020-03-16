var errorText = "Failed. You have not been charged.";

function init() {
  var submitButton = document.getElementById("giving-button");

  var stripe = Stripe("pk_live_20VpW3kP9MacCmc5m49T6kwY");

  var form = document.getElementById("payment-form");
  if (form === null) {
    return;
  }
  form.addEventListener("submit", function(event) {
    event.preventDefault();
    const buttonText = submitButton.innerText;
    submitButton.innerText = "Working...";

    var data = {
      amount: document.getElementById("giving-amount").valueAsNumber * 100,
      description: document.getElementById("giving-fund").value
    };

    // create stripe session
      fetch("https://stcsfc.netlify.com/.netlify/functions/get_checkout_session/", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        console.log(data);
        switch (data.status) {
          case "session-created":
            stripe
              .redirectToCheckout({
                sessionId: data.sessionId
              })
              .then(function(result) {
                submitButton.innerText = result.error.message;
              });
            break;
          case "bad-payload":
            submitButton.innerText = errorText;
            break;
          case "missing-information":
            submitButton.innerText = errorText;
            break;
          case "session-create-failed":
            submitButton.innerText = errorText;
            break;
          default:
            submitButton.innerText = errorText;
        }
      })
      .catch(function(error) {
        console.log(error);
        submitButton.innerText = errorText;
      });
  });
}

module.exports.init = init;
