from flask import Flask, request, jsonify
from models import db, Worker

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///workers.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# Create database automatically
with app.app_context():
    db.create_all()

# ADD WORKER API
@app.route('/add_worker', methods=['POST'])
def add_worker():
    data = request.json

    new_worker = Worker(
        name=data['name'],
        nid=data['nid'],
        phone=data['phone'],
        address=data['address'],
        skills=data['skills'],
        risk_score=calculate_risk_score(data)
    )

    db.session.add(new_worker)
    db.session.commit()

    return jsonify({"message": "Worker added successfully"}), 201


# GET WORKER LIST API
@app.route('/workers', methods=['GET'])
def get_workers():
    workers = Worker.query.all()
    return jsonify([worker.to_dict() for worker in workers])


# RISK SCORE LOGIC (AI Placeholder)
def calculate_risk_score(data):
    score = 0

    if len(data['skills']) < 3:
        score += 2
    if not data['nid']:
        score += 5

    return score


if __name__ == '__main__':
    app.run(debug=True)