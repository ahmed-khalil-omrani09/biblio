import http.server
import socketserver
import json
from http import HTTPStatus
from pathlib import Path
import uuid
from database import Database
from models import utilisateur, livre, emprunt

FRONTEND_DIR = Path(__file__).resolve().parent.parent / 'frontend'

class RequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        self.db = Database()
        self.utilisateur = utilisateur(self.db)
        self.livre = livre(self.db)
        self.emprunt = emprunt(self.db)
        super().__init__(*args, directory=str(FRONTEND_DIR), **kwargs)

    def do_OPTIONS(self):
        self.send_response(HTTPStatus.OK)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def send_json(self, data, status=HTTPStatus.OK):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))

    def get_post_data(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            return json.loads(post_data.decode('utf-8'))
        except (ValueError, json.JSONDecodeError):
            self.send_json({
                'success': False,
                'message': 'Données invalides'
            }, HTTPStatus.BAD_REQUEST)
            return None

    def send_error(self, code, message=None, explain=None):
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(json.dumps({
            'success': False,
            'error': message or 'Unknown error'
        }).encode('utf-8'))

    def do_GET(self):
        if self.path == '/api/livres':
            self.handle_get_livres()
        elif self.path == '/':
            self.path = '/biblio.html'
            super().do_GET()
        else:
            super().do_GET()

    def do_POST(self):
        if self.path == '/api/login':
            self.handle_login()
        elif self.path == '/api/emprunter':
            self.handle_emprunter()
        elif self.path == '/api/utilisateur':
            self.handle_create_utilisateur()
        else:
            self.send_error(HTTPStatus.NOT_FOUND, 'File non trouvée')

    def handle_login(self):
        data = self.get_post_data()
        if not data:
            return

        email = data.get('email')
        mot_de_passe = data.get('mot_de_passe')

        if not email or not mot_de_passe:
            self.send_json({
                'success': False,
                'message': 'Email et mot de passe requis'
            }, HTTPStatus.BAD_REQUEST)
            return
        print("🚀🚀🚀🚀🚀"+mot_de_passe)
        result = self.utilisateur.verifier_identifiants(email, mot_de_passe)
        if result['success'] == False:
            self.send_json(result,HTTPStatus.BAD_REQUEST)
        self.send_json(result)

        

    def handle_get_livres(self):
        try:
            result = self.livre.get_disponibles()
            self.send_json(result)
        except Exception as e:
            self.send_json({
                'success': False,
                'message': str(e)
            }, HTTPStatus.INTERNAL_SERVER_ERROR)

    def handle_emprunter(self):
        data = self.get_post_data()
        if not data:
            return

        id_utilisateur = data.get('id_utilisateur')
        id_livre = data.get('id_livre')
        date_remettre = data.get('date_remettre')

        if not id_utilisateur or not id_livre or not date_remettre:
            self.send_json({
                'success': False,
                'message': 'Données incomplètes'
            }, HTTPStatus.BAD_REQUEST)
            return

        result = self.emprunt.creer(id_utilisateur, id_livre, date_remettre)
        self.send_json(result)

    def handle_create_utilisateur(self):
        data = self.get_post_data()
        if not data:
            return

        id = str(uuid.uuid4())
        nom = data.get("nom")
        prenom = data.get("prenom")
        email = data.get("email")
        tel = data.get("tel")
        password = data.get("password")

        result = self.utilisateur.creer(id, nom, prenom, email, tel, password)
        self.send_json(result)

def run_server(port=8000):
    with socketserver.TCPServer(("", port), RequestHandler) as httpd:
        print(f"📚 Serveur démarré sur http://localhost:{port}")
        print(f"📁 Frontend: {FRONTEND_DIR}")
        print("🗄️  Base de données: database/biblio.db")
        print("🚀 Appuyez sur Ctrl+C pour arrêter")

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Arrêt du serveur...")
            httpd.shutdown()

if __name__ == "__main__":
    run_server()
