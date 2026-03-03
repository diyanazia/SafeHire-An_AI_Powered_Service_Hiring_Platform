fetch("http://127.0.0.1:5000/workers")
  .then(response => response.json())
  .then(data => {
      const container = document.getElementById("workerList");
      container.innerHTML = "";

      if (data.length === 0) {
          container.innerHTML = "<p>No workers registered yet.</p>";
          return;
      }

      data.forEach(worker => {
          container.innerHTML += `
              <div class="card">
                  <h3>${worker.name}</h3>
                  <p><strong>Skills:</strong> ${worker.skills}</p>
                  <p><strong>Risk Score:</strong> ${worker.risk_score}</p>
              </div>
          `;
      });
  })
  .catch(error => {
      console.error("Error loading workers:", error);
  });