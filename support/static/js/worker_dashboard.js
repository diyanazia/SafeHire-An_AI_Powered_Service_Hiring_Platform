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
          <p class="text-white font-medium">No workers registered yet.</p>
          <p class="text-sm text-gray-300 mt-1">Add a worker to see them listed here.</p>
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
          <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-400/20">
            Verified
          </span>
        `;
      }

      if (status === "rejected") {
        return `
          <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-rose-500/20 text-rose-300 border border-rose-400/20">
            Rejected
          </span>
        `;
      }

      return `
        <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-400/20">
          Pending
        </span>
      `;
    };

    const riskPill = (risk) => {
      const num = Number(risk);

      if (Number.isNaN(num)) {
        return `
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-gray-200 border border-white/10">
            Risk: N/A
          </span>
        `;
      }

      if (num <= 30) {
        return `
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-400/20">
            Low Risk • ${num}
          </span>
        `;
      }

      if (num <= 70) {
        return `
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-400/20">
            Medium Risk • ${num}
          </span>
        `;
      }

      return `
        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-rose-500/20 text-rose-300 border border-rose-400/20">
          High Risk • ${num}
        </span>
      `;
    };

    data.forEach((worker) => {
      const name = worker.name || "Unnamed Worker";
      const skillsArr = toSkillArray(worker.skills);
      const status = (worker.verification_status || "Pending").toLowerCase();

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
                  `<span class="px-2.5 py-1 rounded-full text-xs bg-white/10 border border-white/10 text-gray-200">${skill}</span>`
              )
              .join("")
          : `<span class="text-sm text-gray-300">No skills provided</span>`;

      container.innerHTML += `
        <div class="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur transition hover:bg-white/10 hover:shadow-xl">
          <div class="flex items-start justify-between gap-4">
            <div class="flex items-center gap-4">
              <div class="h-12 w-12 rounded-2xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-400/20 flex items-center justify-center text-pink-200 font-semibold">
                ${initials || "W"}
              </div>
              <div>
                <p class="font-semibold leading-5 text-white">${name}</p>
                <p class="text-sm text-gray-300">Registered worker</p>
              </div>
            </div>

            ${statusPill(status)}
          </div>

          <div class="mt-4 flex flex-wrap gap-2">
            ${skillTags}
          </div>

          <div class="mt-5 flex items-center justify-between gap-3">
            ${riskPill(worker.risk_score)}
            <a href="/verify-workers" class="px-4 py-2 rounded-2xl border border-white/10 bg-white/10 hover:bg-white/15 text-sm font-medium text-white transition">
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
      <div class="col-span-full bg-rose-500/10 border border-rose-400/20 rounded-3xl p-6">
        <p class="font-semibold text-rose-300">Could not load workers</p>
        <p class="text-sm text-gray-300 mt-1">Make sure Flask is running and /workers returns JSON.</p>
        <p class="text-xs text-gray-400 mt-2">Error: ${String(error)}</p>
      </div>
    `;
  });