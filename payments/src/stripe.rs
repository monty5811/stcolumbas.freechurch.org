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
    println!("{:?}", charge);
    // pull together params
    let desc = format!(
        "Donation: {} ({}) for {}",
        charge.name, charge.email, charge.fund
    );
    // create client and send request
    let client = stripe::Client::new(stripe_api_key);
    // add params
    let mut params = stripe::ChargeParams::default();
    params.amount = Some(charge.amount);
    params.source = Some(stripe::CustomerSource::Token(&charge.token));
    params.currency = Some(stripe::Currency::GBP);
    params.description = Some(&desc);
    params.statement_descriptor = Some("StColumbas Free Church");

    // make request to create charge
    let charge_ = stripe::Charge::create(&client, params);
    match charge_ {
        Ok(charge) => Ok(String::from(format!("Card charged.\nid={}", charge.id))),
        Err(stripe::Error::Stripe(s_err)) => {
            Err(format!("Card not charged (Stripe Error)\n{:?}", s_err))
        }
        Err(stripe::Error::Io(_)) => Err(String::from("Card not charged (IO error)")),
        Err(stripe::Error::Http(http_err)) => {
            Err(format!("Card not charged (HTTP Error)\n{:?}", http_err))
        }
        Err(stripe::Error::Conversion(_)) => {
            Err(String::from("Card not charged\n(Conversion error)"))
        }
    }
}
