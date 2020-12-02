#!/usr/bin/env python
import sys

from livereload.server import Server, shell
from livereload.handlers import StaticFileHandler
from tornado.web import HTTPError


class NiceStaticFileHandler(StaticFileHandler):
    def validate_absolute_path(self, root: str, absolute_path: str):
        try:
            return super().validate_absolute_path(root, absolute_path)
        except HTTPError as e:
            print(e)
            if e.status_code == 404:
                return super().validate_absolute_path(root, absolute_path + ".html")
            else:
                raise (e)


class NiceUrlsServer(Server):
    def get_web_handlers(self, script):
        return [
            (
                r"/(.*)",
                NiceStaticFileHandler,
                {"path": self.root or ".", "default_filename": "index.html",},
            ),
        ]


if __name__ == "__main__":
    server = NiceUrlsServer()
    server.watch("templates/", shell("make build", shell="/bin/bash"))
    server.watch("src/", shell("make build", shell="/bin/bash"))
    server.watch("public/", shell("make build", shell="/bin/bash"))
    server.watch(
        "assets/", shell("make css-build js-build build", shell="/bin/bash"), delay=1
    )
    server.serve(host="0.0.0.0", root="dist", port=int(sys.argv[1]))
