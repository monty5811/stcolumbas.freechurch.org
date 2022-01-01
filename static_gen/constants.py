import os
from collections import namedtuple

SRC_DIR = "src"
STATIC_DIR = "static"
PUBLIC_DIR = "public"
DIST_DIR = "dist"
CACHE_DIR = ".image_cache"

NavLink = namedtuple("NavLink", ["text", "href", "children"])

NAV_LINKS = [
    NavLink("Jesus", "/jesus", []),
    NavLink(
        "About",
        None,
        [
            NavLink("Our Vision", "/about/our-vision", []),
            NavLink("Our Team", "/about/our-team", []),
            NavLink("Church Plants", "/about/church-plants", []),
            NavLink("Contact Us", "/about/contact-us", []),
        ],
    ),
    NavLink(
        "Connect",
        None,
        [
            NavLink("Visit", "/connect/visit", []),
            NavLink("Community", "/connect/community", []),
            NavLink("Giving", "/connect/giving", []),
            NavLink("Ministries", "/connect/ministries", []),
            NavLink("Serving", "/connect/serving", []),
        ],
    ),
    NavLink("Updates", "/updates", []),
]
