function getStatusPillClass(status) {
  if (status === "assigned") {
    return "bg-amber-50 text-amber-700 border-amber-100";
  }
  if (status === "completed") {
    return "bg-emerald-50 text-emerald-700 border-emerald-100";
  }
  return "bg-brand-50 text-brand-700 border-brand-100";
}

function loadJobs() {
  fetch("/jobs_api")
    .then((response) => response.json())
    .then((jobs) => {
      const jobList = document.getElementById("jobList");
      jobList.innerHTML = "";

      if (!Array.isArray(jobs) || jobs.length === 0) {
        jobList.innerHTML = `
          <div class="sm:col-span-2 text-center py-10">
            <p class="text-slate-700 font-medium">No jobs posted yet.</p>
            <p class="text-sm text-slate-500 mt-1">Post a job to see it listed here.</p>
          </div>
        `;
        return;
      }

      jobs.forEach((job) => {
        jobList.innerHTML += `
          <div class="border border-[#E5E7EB] rounded-3xl p-5 transition hover:shadow-sm bg-white">
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="font-semibold leading-5">${job.title}</p>
                <p class="text-sm text-slate-600 mt-1">${job.category} • ${job.location}</p>
              </div>
              <span class="px-3 py-1 rounded-full text-xs font-medium border ${getStatusPillClass(job.status)}">
                ${job.status}
              </span>
            </div>

            <p class="text-sm text-slate-600 mt-4">${job.description || "No description provided."}</p>

            <div class="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <p class="text-sm font-medium text-slate-700">Budget: ৳${job.budget}</p>
              <button class="px-4 py-2 rounded-2xl border border-[#E5E7EB] bg-white hover:bg-slate-50 text-sm font-medium">
                View
              </button>
            </div>
          </div>
        `;
      });
    })
    .catch((error) => {
      console.error("Error loading jobs:", error);
      document.getElementById("jobList").innerHTML = `
        <div class="sm:col-span-2 text-center py-10">
          <p class="text-rose-600 font-medium">Could not load jobs.</p>
        </div>
      `;
    });
}

document.getElementById("jobForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = {
    title: this.title.value,
    category: this.category.value,
    location: this.location.value,
    budget: this.budget.value,
    description: this.description.value
  };

  fetch("/add_job", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  })
    .then((response) => response.json())
    .then(() => {
      this.reset();
      loadJobs();
    })
    .catch((error) => {
      console.error("Error posting job:", error);
    });
});

loadJobs();

document.getElementById("hireForm").addEventListener("submit", function(e) {

  e.preventDefault()

  const formData = {
    employer_name: this.employer_name.value,
    job_id: this.job_id.value,
    worker_id: this.worker_id.value
  }

  fetch("/hire", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  })
  .then(response => response.json())
  .then(data => {
    alert(data.message || "Worker hired successfully")
    this.reset()
  })
  .catch(error => {
    console.error("Error hiring worker:", error)
  })

})