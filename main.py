from support.app import app
from support.models import db, Worker


if __name__ == '__main__':
    app.run(debug=True)