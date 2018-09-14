extern crate bodyparser;
extern crate getopts;
extern crate iron;
extern crate unicase;

#[macro_use]
extern crate serde_derive;

use iron::prelude::*;
use iron::{headers, method, status, AfterMiddleware, Chain};
use getopts::Options;
use std::env;
use unicase::UniCase;

mod stripe;

#[derive(Debug)]
struct Domains {
    no_scheme: String,
    with_scheme: String,
}

fn domains_from_origin(origin: &headers::Origin) -> Domains {
    let base = match origin.host.port {
        Some(p) => format!("{}:{}", origin.host.hostname, p),
        None => format!("{}", origin.host.hostname),
    };
    Domains {
        no_scheme: base.to_owned(),
        with_scheme: format!("{}://{}", origin.scheme, base),
    }
}

fn domains_from_header(maybe_origin: std::option::Option<&headers::Origin>) -> Domains {
    match maybe_origin {
        None => Domains {
            no_scheme: "_".to_string(),
            with_scheme: "_".to_string(),
        },
        Some(origin) => domains_from_origin(origin),
    }
}

struct DefaultContentType;
impl AfterMiddleware for DefaultContentType {
    fn after(&self, req: &mut Request, mut resp: Response) -> IronResult<Response> {
        let allowed_domains = [
            String::from("stcolumbas.freechurch.org"),
            String::from("stcsfc.netlify.com"),
        ];

        let domains = domains_from_header(req.headers.get::<iron::headers::Origin>());

        if allowed_domains.contains(&domains.no_scheme) {
            resp.headers.set(headers::AccessControlAllowOrigin::Value(
                domains.with_scheme.to_owned().to_string(),
            ));
            resp.headers.set(headers::AccessControlAllowMethods(vec![
                method::Method::Get,
                method::Method::Post,
            ]));
            resp.headers.set(headers::AccessControlAllowHeaders(vec![
                UniCase("accept".to_owned()),
                UniCase("accept-encoding".to_owned()),
                UniCase("accept-language".to_owned()),
                UniCase("connection".to_owned()),
                UniCase("content-type".to_owned()),
            ]));
        }
        Ok(resp)
    }
}

fn handle_post(req: &mut Request) -> Response {
    println!("POST request received");
    let body = req.get::<bodyparser::Struct<stripe::ChargeRequest>>();

    match body {
        Ok(Some(charge)) => {
            println!("Parsed request body, starting Stripe request");
            match stripe::charge(charge) {
                Ok(status) => {
                    println!("Stripe charge successful");
                    Response::with((status::Created, status))
                }
                Err(err) => {
                    println!("Stripe charge failed: {:?}", err);
                    Response::with((status::BadRequest, err))
                }
            }
        }
        Ok(None) => {
            println!("Request body was empty");
            Response::with(status::BadRequest)
        }
        Err(err) => {
            println!("Failed to parse request body: {:?}", err);
            Response::with(status::BadRequest)
        }
    }
}

fn handle_get() -> Response {
    println!("Wake up endpoint hit");
    Response::with((status::Ok, "Nothing to see here..."))
}

fn handle_options() -> Response {
    println!("OPTIONS request received");
    Response::with(status::Ok)
}

fn handler(req: &mut Request) -> IronResult<Response> {
    Ok(match req.method {
        method::Post => handle_post(req),
        method::Get => handle_get(),
        method::Options => handle_options(),
        _ => Response::with((status::BadRequest, "Method not supported")),
    })
}

fn main() {
    // parse cmd line options
    let args: Vec<String> = env::args().collect();
    let mut opts = Options::new();
    opts.reqopt("p", "port", "port to bind to", "PORT");
    opts.reqopt("h", "host", "host to bind to", "HOST");
    let matches = match opts.parse(&args[1..]) {
        Ok(m) => m,
        Err(f) => panic!(f.to_string()),
    };
    let port = match matches.opt_str("p") {
        Some(p) => p,
        None => String::from("3000"),
    };
    let host = match matches.opt_str("h") {
        Some(h) => h,
        None => String::from("localhost"),
    };
    // start server
    let addr = format!("{}:{}", host, port);
    println!("Starting server on {}", addr);
    let mut chain = Chain::new(handler);
    chain.link_after(DefaultContentType);
    Iron::new(chain).http(addr).unwrap();
}
