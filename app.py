from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/")
def home():
    return "SafeHire Flask Server Running"

@app.route("/workers")
def workers():
    sample_workers = [
        {"name": "Rahim", "skills": "Electrician", "risk_score": 30},
        {"name": "Akbar", "skills": "Plumber", "risk_score": 58},
        {"name": "Dulal", "skills": "Carpenter", "risk_score": 76}
    ]
    return jsonify(sample_workers)

if __name__ == "__main__":
    app.run(debug=True)