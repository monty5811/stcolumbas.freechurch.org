var Elm = require('./Payments.elm');

function init() {
  var elmContainer = document.getElementById('elmContainer');
  var submitButton = document.getElementById('giving-button');

  if (elmContainer !== null) {
    var app = Elm.Payments.embed(elmContainer);

    function stripeTokenHandler(result) {
      app.ports.stripeResult.send({
        result: result,
        name: document.getElementById('name').value,
        amount: document.getElementById('amount').value,
        email: document.getElementById('email').value,
        fund: document.getElementById('fund').value,
      });
    }

    var stripe = Stripe('pk_live_20VpW3kP9MacCmc5m49T6kwY');
    var elements = stripe.elements();
    var card = elements.create('card', {
      style: {
        base: {
          lineHeight: '1.429',
        },
      },
    });

    card.mount('#card-element');

    // pass name to stripe:
    var nameField = document.getElementById('name');
    nameField.addEventListener('change', function(event) {
      card.update({ value: { name: event.target.value } });
    });

    // Handle real-time validation errors from the card Element.
    card.addEventListener('change', function(event) {
      var displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
        submitButton.disabled = true;
      } else {
        displayError.textContent = '';
        submitButton.disabled = false;
      }
    });

    var form = document.getElementById('payment-form');
    form.addEventListener('submit', function(event) {
      event.preventDefault();

      const buttonText = submitButton.innerText;
      submitButton.innerText = 'Working...';
      // create stripe token
      stripe.createToken(card).then(function(result) {
        if (result.error) {
          if (result.error.type === 'validation_error') {
            // change text back to donate as stripe will handle this error for us
            submitButton.innerText = buttonText;
          } else {
            // Inform the user if there was an error
            var errorElement = document.getElementById('card-errors');
            errorElement.textContent = result.error.message;
          }
        } else {
          submitButton.remove();
          app.ports.startLoading.send(null);
          // Send the token to the server
          stripeTokenHandler(result);
        }
      });
    });
  }
}

module.exports.init = init;
