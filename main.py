from flask import Flask, request, jsonify
from support.models import db, Worker

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///workers.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "SafeHire backend running",
        "routes": {
            "GET": ["/workers"],
            "POST": ["/add_worker"]
        }
    }), 200


def parse_skills(skills_raw):
    # Accept "plumbing, electrician" or ["plumbing","electrician"]
    if isinstance(skills_raw, list):
        skills = [str(s).strip() for s in skills_raw if str(s).strip()]
    else:
        skills = [s.strip() for s in str(skills_raw or "").split(",") if s.strip()]
    return skills


def calculate_risk_score(data):
    # Placeholder scoring (clean + consistent)
    score = 0

    skills_list = parse_skills(data.get("skills"))
    if len(skills_list) < 2:
        score += 2

    nid = str(data.get("nid", "")).strip()
    if not nid:
        score += 5
    elif len(nid) < 6:
        score += 2

    phone = str(data.get("phone", "")).strip()
    if not phone:
        score += 2

    return score


@app.route('/add_worker', methods=['POST'])
def add_worker():
    data = request.get_json(silent=True) or {}

    required = ["name", "nid", "phone", "address", "skills"]
    missing = [k for k in required if not str(data.get(k, "")).strip()]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    nid = str(data["nid"]).strip()

    # Duplicate NID check
    if Worker.query.filter_by(nid=nid).first():
        return jsonify({"error": "Worker with this NID already exists"}), 409

    skills_list = parse_skills(data["skills"])

    new_worker = Worker(
        name=str(data["name"]).strip(),
        nid=nid,
        phone=str(data["phone"]).strip(),
        address=str(data["address"]).strip(),
        skills=", ".join(skills_list),
        risk_score=calculate_risk_score(data)
    )

    db.session.add(new_worker)
    db.session.commit()

    return jsonify({"message": "Worker added successfully", "worker": new_worker.to_dict()}), 201


@app.route('/workers', methods=['GET'])
def get_workers():
    workers = Worker.query.all()
    return jsonify([worker.to_dict() for worker in workers]), 200


if __name__ == '__main__':
    app.run(debug=True)