const jobList = document.getElementById("jobList");
const jobForm = document.getElementById("jobForm");
const hireForm = document.getElementById("hireForm");

function getStatusPillClass(status) {
  if (status === "assigned") {
    return "bg-amber-50 text-amber-700 border-amber-100";
  }
  if (status === "completed") {
    return "bg-emerald-50 text-emerald-700 border-emerald-100";
  }
  return "bg-brand-50 text-brand-700 border-brand-100";
}

function getStatusLabel(status) {
  if (status === "assigned") return "Assigned";
  if (status === "completed") return "Completed";
  return "Open";
}

function renderJobs(jobs, matchMap = {}) {
  jobList.innerHTML = "";

  if (!Array.isArray(jobs) || jobs.length === 0) {
    jobList.innerHTML = `
      <div class="sm:col-span-2 text-center py-10">
        <p class="text-slate-700 font-medium">No jobs posted yet</p>
        <p class="text-sm text-slate-500 mt-1">Post a job to see it listed here</p>
      </div>
    `;
    return;
  }

  jobs.forEach((job) => {
    const match = matchMap[job.id];

    jobList.innerHTML += `
      <div class="border border-[#E5E7EB] rounded-3xl p-5 transition hover:shadow-sm bg-white">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="font-semibold leading-5">${job.title}</p>
            <p class="text-sm text-slate-600 mt-1">${job.category} • ${job.location}</p>
          </div>
          <span class="px-3 py-1 rounded-full text-xs font-medium border ${getStatusPillClass(job.status)}">
            ${getStatusLabel(job.status)}
          </span>
        </div>

        <p class="text-sm text-slate-600 mt-4">${job.description || "No description provided."}</p>
        
                <div class="mt-4 p-3 rounded-2xl bg-brand-50 border border-brand-100">
          <p class="text-xs font-semibold text-brand-700 uppercase tracking-wide">Suggested Worker</p>
          <p class="text-sm text-slate-800 mt-1">
            ${match ? match.matched_worker : "No suggestion available"}
          </p>
          ${
            match && match.worker_id
              ? `<p class="text-xs text-slate-500 mt-1">Worker ID: ${match.worker_id} • Match Score: ${match.score}</p>`
              : ""
          }
        </div>

        <div class="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
          <p class="text-sm font-medium text-slate-700">Budget: ৳${job.budget}</p>
          <p class="text-xs text-slate-500">Job ID: ${job.id}</p>
        </div>
      </div>
    `;
  });
}

async function loadJobs() {
  try {
    const [jobsResponse, matchesResponse] = await Promise.all([
      fetch("/jobs_api"),
      fetch("/job_matches")
    ]);

    if (!jobsResponse.ok) throw new Error(`Jobs HTTP ${jobsResponse.status}`);
    if (!matchesResponse.ok) throw new Error(`Matches HTTP ${matchesResponse.status}`);

    const jobs = await jobsResponse.json();
    const matches = await matchesResponse.json();

    const matchMap = {};
    matches.forEach((m) => {
      matchMap[m.job_id] = m;
    });

    renderJobs(jobs, matchMap);
  } catch (error) {
    console.error("Error loading jobs:", error);
    jobList.innerHTML = `
      <div class="sm:col-span-2 text-center py-10">
        <p class="text-rose-600 font-medium">Could not load jobs.</p>
      </div>
    `;
  }
}

jobForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = {
    title: this.title.value.trim(),
    category: this.category.value.trim(),
    location: this.location.value.trim(),
    budget: this.budget.value.trim(),
    description: this.description.value.trim()
  };

  try {
    const response = await fetch("/add_job", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to post job");
    }
    alert(data.message || "Job posted successfully");
    this.reset();
    loadJobs();
  } catch (error) {
    console.error("Error posting job:", error);
    alert(error.message || "Could not post job");
  }
});
hireForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = {
    employer_name: this.employer_name.value.trim(),
    job_id: this.job_id.value.trim(),
    worker_id: this.worker_id.value.trim()
  };
    try {
    const response = await fetch("/hire", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to hire worker");
    }

    alert(data.message || "Worker hired successfully");
    this.reset();
    loadJobs();
  } catch (error) {
    console.error("Error hiring worker:", error);
    alert(error.message || "Could not hire worker");
  }
});

loadJobs();

