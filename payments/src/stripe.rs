extern crate stripe;

use std::env;

#[derive(Debug, Clone, Deserialize)]
pub struct ChargeRequest {
    name: String,
    amount: u64,
    email: String,
    fund: String,
    token: String,
}

static GENERIC_ERROR: &'static str = "No message from Stripe..

I'm not sure if your card was charged...

Maybe wait a bit or get in touch to check.";

pub fn charge(charge: ChargeRequest) -> Result<String, String> {
    // get stripe API key
    let stripe_api_key = match env::var("STRIPE_API_KEY") {
        Ok(val) => val,
        Err(_err) => String::from("No key provided!"),
    };
    if stripe_api_key == "No key provided!" {
        return Err(String::from(
            "Card not charged (no Stripe API Key set on server)",
        ));
    }
    // pull together params
    let desc = format!(
        "Donation: {} ({}) for {}",
        charge.name, charge.email, charge.fund
    );
    println!("About to create charge ({}p) for {}", charge.amount, desc);

    // create client and send request
    let client = stripe::Client::new(stripe_api_key);
    // add params
    let mut params = stripe::ChargeParams::default();
    params.amount = Some(charge.amount);
    params.source = Some(stripe::CustomerSource::Token(&charge.token));
    params.currency = Some(stripe::Currency::GBP);
    params.description = Some(&desc);
    params.statement_descriptor = Some("StColumbas Free Church");
    params.receipt_email = Some(&charge.email);

    // make request to create charge
    let charge_ = stripe::Charge::create(&client, params);
    match charge_ {
        Ok(charge) => {
            println!("Card charged successfully: {}", charge.id);
            Ok(String::from(format!("Card charged.")))
        }
        Err(stripe::Error::Stripe(s_err)) => match s_err.message {
            Some(stripe_message) => Err(format!("{}", stripe_message)),
            None => Err(format!("No message provided.")),
        },
        Err(stripe::Error::Io(_io_err)) => Err(String::from(GENERIC_ERROR)),
        Err(stripe::Error::Http(_http_err)) => Err(String::from(GENERIC_ERROR)),
        Err(stripe::Error::Conversion(_)) => Err(String::from(GENERIC_ERROR)),
    }
}
