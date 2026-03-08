const workerForm = document.getElementById("workerForm");
const formMessage = document.getElementById("formMessage");

workerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(workerForm);

  const payload = {
    name: formData.get("name").trim(),
    nid: formData.get("nid").trim(),
    phone: formData.get("phone").trim(),
    address: formData.get("address").trim(),
    skills: formData.get("skills").trim()
  };

  formMessage.className = "message";
  formMessage.textContent = "";

  try {
    const response = await fetch("/add_worker", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to add worker");
    }

    formMessage.textContent = result.message || "Worker added successfully";
    formMessage.className = "message success";
    workerForm.reset();
  } catch (error) {
    formMessage.textContent = error.message || "Something went wrong";
    formMessage.className = "message error";
  }
});