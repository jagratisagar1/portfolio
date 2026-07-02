import http.server
import json
import os
import sys

PORT = 8000

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/api/contact':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode('utf-8'))
                
                # Log the message to a local file
                messages_file = 'contact_messages.json'
                messages = []
                if os.path.exists(messages_file):
                    try:
                        with open(messages_file, 'r', encoding='utf-8') as f:
                            messages = json.load(f)
                    except Exception:
                        pass
                
                messages.append(data)
                with open(messages_file, 'w', encoding='utf-8') as f:
                    json.dump(messages, f, indent=4)
                
                # Print to terminal / output
                print("\n" + "="*55)
                print(" NEW CONTACT FORM SUBMISSION RECEIVED LOCALLY:")
                print(f" Name:    {data.get('name')}")
                print(f" Email:   {data.get('email')}")
                print(f" Subject: {data.get('_subject')}")
                print(f" Message: {data.get('message')}")
                print("="*55 + "\n")
                sys.stdout.flush()
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                response = {"success": "true", "message": "Message received locally! Saved to contact_messages.json"}
                self.wfile.write(json.dumps(response).encode('utf-8'))
            except Exception as e:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                response = {"success": "false", "message": str(e)}
                self.wfile.write(json.dumps(response).encode('utf-8'))
        else:
            # Fallback to default post behaviour
            super().do_POST()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.end_headers()

if __name__ == '__main__':
    # Change working directory to the directory of this file
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    server_address = ('', PORT)
    httpd = http.server.HTTPServer(server_address, CustomHandler)
    print(f"Serving HTTP on port {PORT} (custom server with local /api/contact handler)...")
    sys.stdout.flush()
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server.")
