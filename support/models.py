from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Worker(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # Worker ID
    name = db.Column(db.String(100), nullable=False)
    nid = db.Column(db.String(50), unique=True, nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    skills = db.Column(db.String(200), nullable=False)

    # Week 2 updates
    verification_status = db.Column(db.String(50), default="Pending")
    work_experience = db.Column(db.String(200))
    references = db.Column(db.String(200))
    risk_score = db.Column(db.Float, default=0.0)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "nid": self.nid,
            "phone": self.phone,
            "address": self.address,
            "skills": self.skills,
            "verification_status": self.verification_status,    # WEEk 2
            "work_experience": self.work_experience,            # WEEk 2
            "references": self.references,                      # WEEk 2
            "risk_score": self.risk_score
        }