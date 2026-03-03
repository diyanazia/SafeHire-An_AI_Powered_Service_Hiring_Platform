@app.route('/add_worker', methods=['POST'])
def add_worker():
    data = request.json
    # insert into database
    return jsonify({"message": "Worker added successfully"})