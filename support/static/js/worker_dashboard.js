fetch("/workers")
  .then((response) => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  })
  .then((data) => {
    const container = document.getElementById("workerList");
    const emptyState = document.getElementById("emptyState");

    container.innerHTML = "";

    if (!Array.isArray(data) || data.length === 0) {
      if (emptyState) emptyState.style.display = "none";
      container.innerHTML = `
        <div class="col-span-full text-center py-10">
          <p class="text-slate-700 font-medium">No workers registered yet.</p>
          <p class="text-sm text-slate-500 mt-1">Add a worker to see them listed here.</p>
        </div>
      `;
      return;
    }

    const toSkillArray = (skills) => {
      if (Array.isArray(skills)) return skills.filter(Boolean);
      if (typeof skills === "string") {
        return skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
      return [];
    };
    const statusPill = (status) => {
      if (status === "verified") {
        return `
          <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-brand-50 text-brand-700 border border-brand-100">
             Verified
          </span>
        `;
      }

      if (status === "rejected") {
        return `
          <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-100">
             Rejected
          </span>
        `;
      }

      return `
        <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
          ⏳ Pending
        </span>
      `;
    };
       
    const riskPill = (risk) => {
      const num = Number(risk);
      if (Number.isNaN(num)) {
        return `<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-50 text-slate-700 border border-slate-200">Risk: N/A</span>`;
      }
      if (num <= 30) {
        return `<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">Low Risk • ${num}</span>`;
      }
      if (num <= 70) {
        return `<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">Medium Risk • ${num}</span>`;
      }
      return `<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-100">High Risk • ${num}</span>`;
    };

    data.forEach((worker) => {
      const name = worker.name || "Unnamed Worker";
      const skillsArr = toSkillArray(worker.skills);
      const status = (worker.verification_status || "pending").toLowerCase();
      const initials =
        name
          .split(" ")
          .slice(0, 2)
          .map((p) => p[0]?.toUpperCase())
          .join("");

      const skillTags =
        skillsArr.length > 0
          ? skillsArr
              .slice(0, 5)
              .map(
                (skill) =>
                  `<span class="px-2.5 py-1 rounded-full text-xs bg-slate-50 border border-slate-200 text-slate-700">${skill}</span>`
              )
              .join("")
          : `<span class="text-sm text-slate-500">No skills provided</span>`;

      container.innerHTML += `
        <div class="bg-white border border-[#E5E7EB] rounded-3xl p-5 transition hover:shadow-sm">
          <div class="flex items-start justify-between gap-4">
            <div class="flex items-center gap-4">
              <div class="h-12 w-12 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-700 font-semibold">
                ${initials || "W"}
              </div>
              <div>
                <p class="font-semibold leading-5">${name}</p>
                <p class="text-sm text-slate-600">Registered worker</p>
              </div>
            </div>

            ${statusPill(status)}
          </div>

          <div class="mt-4 flex flex-wrap gap-2">
            ${skillTags}
          </div>

          <div class="mt-5 flex items-center justify-between gap-3">
            ${riskPill(worker.risk_score)}
            <a href="/verify-workers" class="px-4 py-2 rounded-2xl border border-[#E5E7EB] bg-white hover:bg-slate-50 text-sm font-medium">
              Review
            </a>
          </div>
        </div>
      `;
    });

    if (emptyState) emptyState.style.display = "none";
  })
  .catch((error) => {
    console.error("Error loading workers:", error);

    const container = document.getElementById("workerList");
    const emptyState = document.getElementById("emptyState");
    if (emptyState) emptyState.style.display = "none";

    container.innerHTML = `
      <div class="col-span-full bg-white border border-rose-200 rounded-3xl p-6">
        <p class="font-semibold text-rose-700">Could not load workers</p>
        <p class="text-sm text-slate-600 mt-1">Make sure Flask is running and /workers returns JSON.</p>
        <p class="text-xs text-slate-500 mt-2">Error: ${String(error)}</p>
      </div>
    `;
  });