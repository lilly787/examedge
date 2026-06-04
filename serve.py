"""
ExamEdge — Local Dev Server
Run: python serve.py
Then open http://localhost:8080 in your browser.
"""
import http.server
import socketserver
import webbrowser
import threading
import os

PORT = 8080
HOST = "localhost"


class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, fmt, *args):
        # Suppress noisy request logs; only show errors
        if self.command in ("GET", "HEAD") and "200" in str(args):
            pass
        else:
            super().log_message(fmt, *args)

    def end_headers(self):
        # Allow local JS modules + localStorage
        self.send_header("Cache-Control", "no-cache")
        self.send_header("Access-Control-Allow-Origin", "*")
        super().end_headers()


def open_browser():
    import time
    time.sleep(0.8)
    webbrowser.open(f"http://{HOST}:{PORT}/landing.html")


if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    threading.Thread(target=open_browser, daemon=True).start()

    print("=" * 50)
    print("  ExamEdge Local Server")
    print(f"  http://{HOST}:{PORT}/landing.html")
    print("  Press Ctrl+C to stop")
    print("=" * 50)

    with socketserver.TCPServer((HOST, PORT), Handler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n[Stopped]")
