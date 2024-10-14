from http.server import HTTPServer, SimpleHTTPRequestHandler
import os


class ImageServer(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path.endswith(".png"):
            self.send_response(200)
            self.send_header("Content-type", "image/png")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
            self.send_header(
                "Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept"
            )
            self.end_headers()
            with open(self.path[1:], "rb") as f:
                self.wfile.write(f.read())
        else:
            self.send_error(404, "File not found")

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header(
            "Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept"
        )
        self.end_headers()


def run(port=8000):
    server_address = ("", port)
    httpd = HTTPServer(server_address, ImageServer)
    print(f"Serving images on port {port}")
    httpd.serve_forever()


if __name__ == "__main__":
    run()
