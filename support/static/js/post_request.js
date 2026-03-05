document.getElementById("workerForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const formData = {
        name: e.target.name.value,
        nid: e.target.nid.value,
        phone: e.target.phone.value,
        address: e.target.address.value,
        skills: e.target.skills.value
    };

    fetch("http://127.0.0.1:5000/add_worker", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(data => alert(data.message));
});