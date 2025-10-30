from flask import Flask, render_template
import os
import db_utils
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__, template_folder='../templates', static_folder='../static')
            
app.secret_key = os.getenv("SECRET_KEY")

@app.errorhandler(404)
def page_not_found(e):
    return render_template("404.html"), 404

from routes import routes_bp
from api_routes import api_bp

app.register_blueprint(routes_bp)
app.register_blueprint(api_bp)

if __name__ == '__main__':
    db_utils.init_db()
    _debug = os.getenv("DEBUG")
    app.run(debug=_debug)


