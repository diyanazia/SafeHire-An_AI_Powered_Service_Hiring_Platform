from flask import Flask, jsonify, render_template, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from support.models import db, Worker, Job

app = Flask(
    __name__,
    template_folder="templates",
    static_folder="static"
)

CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///workers.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/worker-dashboard")
def worker_dashboard():
    return render_template("worker_dashboard.html")

@app.route("/add-worker")
def add_worker_page():
    return render_template("worker_page.html")

@app.route("/verify-workers")
def verify_workers_page():
    return render_template("verify_workers.html")

@app.route("/jobs")
def jobs_page():
    return render_template("jobs.html")

@app.route("/workers", methods=["GET"])
def get_workers():
    workers = Worker.query.all()
    return jsonify([
        {
            "id": w.id,
            "name": w.name,
            "skills": w.skills,
            "risk_score": w.risk_score,
            "verification_status": w.verification_status
        }
        for w in workers
    ])
@app.route("/add_worker", methods=["POST"])
def add_worker():
    data = request.get_json(silent=True) or {}

    name = data.get("name", "").strip()
    nid = data.get("nid", "").strip()
    phone = data.get("phone", "").strip()
    address = data.get("address", "").strip()
    skills = data.get("skills", "").strip()
    verification_status = data.get("verification_status", "pending")
    
    if not all([name, nid, phone, address, skills]):
        return jsonify({"error": "Missing required fields"}), 400
    if Worker.query.filter_by(nid=nid).first():
        return jsonify({"error": "Worker with this NID already exists"}), 400

    risk_score = len([s for s in skills.split(",") if s.strip()]) * 10

    new_worker = Worker(
        name=name,
        nid=nid,
        phone=phone,
        address=address,
        skills=skills,
        risk_score=risk_score,
        verification_status="pending"
    )

    db.session.add(new_worker)
    db.session.commit()

    return jsonify({"message": "Worker added successfully"}), 201

@app.route("/verify_worker/<int:worker_id>", methods=["POST"])
def verify_worker(worker_id):
    data = request.get_json(silent=True) or {}
    status = (data.get("status") or "").strip().lower()

    if status not in ["pending", "verified", "rejected"]:
        return jsonify({"error": "Invalid status"}), 400

    worker = Worker.query.get(worker_id)
    if not worker:
        return jsonify({"error": "Worker not found"}), 404

    worker.verification_status = status
    db.session.commit()
    return jsonify({"message": "Worker verification updated"})


@app.route("/jobs_api", methods=["GET"])
def get_jobs():

    jobs = Job.query.all()

    return jsonify([job.to_dict() for job in jobs])


@app.route("/add_job", methods=["POST"])
def add_job():

    data = request.get_json()

    title = data.get("title")
    category = data.get("category")
    location = data.get("location")
    budget = data.get("budget")
    description = data.get("description")

    new_job = Job(
        title=title,
        category=category,
        location=location,
        budget=budget,
        description=description
    )

    db.session.add(new_job)
    db.session.commit()

    return jsonify({"message": "Job added successfully"})

if __name__ == "__main__":
    app.run(debug=True)