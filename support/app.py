from flask import Flask, request, jsonify
from models import db, Worker

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///workers.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# Create database automatically
with app.app_context():
    db.create_all()

# ADD WORKER API (UPDATED FOR WEEK 2)
@app.route('/add_worker', methods=['POST'])
def add_worker():
    data = request.get_json()

    # Basic validation
    required_fields = ['name', 'nid', 'phone', 'address', 'skills']
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({"error": f"{field} is required"}), 400

    # Check duplicate NID (security feature)
    existing_worker = Worker.query.filter_by(nid=data['nid']).first()
    if existing_worker:
        return jsonify({"error": "Worker with this NID already exists"}), 409

    new_worker = Worker(
        name=data['name'],
        nid=data['nid'],
        phone=data['phone'],
        address=data['address'],
        skills=data['skills'],
        work_experience=data.get('work_experience'),  # WEEk 2
        references=data.get('references'),            # WEEk 2
        verification_status="Pending",                # WEEK 2 
        risk_score=calculate_risk_score(data)
    )

    db.session.add(new_worker)
    db.session.commit()

    return jsonify({
        "message": "Worker added successfully",
        "worker": new_worker.to_dict()
    }), 201


# GET WORKER LIST API
@app.route('/workers', methods=['GET'])
def get_workers():
    workers = Worker.query.all()
    return jsonify([worker.to_dict() for worker in workers])

# VERIFY / UPDATE WORKER STATUS (Week 2 Update)
@app.route('/verify_worker/<int:id>', methods=['PUT'])
def verify_worker(id):
    worker = Worker.query.get(id)

    if not worker:
        return jsonify({"error": "Worker not found"}), 404

    data = request.get_json()

    if 'verification_status' not in data:
        return jsonify({"error": "verification_status is required"}), 400

    worker.verification_status = data['verification_status']
    db.session.commit()

    return jsonify({
        "message": "Verification status updated",
        "worker": worker.to_dict()
    }), 200

# RISK SCORE LOGIC (AI Placeholder - Improved)
def calculate_risk_score(data):
    score = 0

    skills = data.get('skills', '')
    experience = data.get('work_experience')

    # Weak skill profile
    if len(skills) < 5:
        score += 2

    # Missing experience increases risk
    if not experience:
        score += 1

    # Missing NID = high risk
    if not data.get('nid'):
        score += 5

    return score


if __name__ == '__main__':
    app.run(debug=True)

# SEARCH WORKERS BY SKILL (Smart Matching) - WEEK 2 Update
@app.route('/search_workers', methods=['GET'])
def search_workers():
    skill = request.args.get('skill')

    if not skill:
        return jsonify({"error": "Skill parameter is required"}), 400

    workers = Worker.query.filter(Worker.skills.ilike(f"%{skill}%")).all()

    return jsonify([worker.to_dict() for worker in workers]), 200