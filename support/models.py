from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Worker(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # Worker ID
    name = db.Column(db.String(100), nullable=False)
    nid = db.Column(db.String(50), unique=True, nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    skills = db.Column(db.String(200), nullable=False)
    risk_score = db.Column(db.Float, default=0.0)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "nid": self.nid,
            "phone": self.phone,
            "address": self.address,
            "skills": self.skills,
            "risk_score": self.risk_score
        }