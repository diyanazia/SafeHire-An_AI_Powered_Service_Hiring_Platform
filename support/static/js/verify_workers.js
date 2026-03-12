const verifyList = document.getElementById("verifyList");

const pillClass = (status) => {
  if (status === "Verified") {
    return "bg-emerald-500/20 text-emerald-300 border border-emerald-400/20";
  }
  if (status === "Rejected") {
    return "bg-rose-500/20 text-rose-300 border border-rose-400/20";
  }
  return "bg-amber-500/20 text-amber-300 border border-amber-400/20";
};

const label = (status) => {
  if (status === "Verified") return "✅ Verified";
  if (status === "Rejected") return "❌ Rejected";
  return "⏳ Pending";
};

function renderWorkers(workers) {
  verifyList.innerHTML = "";

  if (!Array.isArray(workers) || workers.length === 0) {
    verifyList.innerHTML = `
      <div class="col-span-full text-center py-10">
        <p class="text-white font-medium">No workers found.</p>
        <p class="text-sm text-gray-300 mt-1">Add workers first to verify them here.</p>
      </div>
    `;
    return;
  }

  workers.forEach((w) => {
    verifyList.innerHTML += `
      <div class="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur transition hover:bg-white/10 hover:shadow-xl">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="font-semibold text-white">${w.name}</p>
            <p class="text-sm text-gray-300 mt-1">NID: ${w.nid}</p>
            <p class="text-sm text-gray-300">Risk Score: ${w.risk_score}</p>
            <p class="text-sm text-gray-300">Skills: ${w.skills}</p>
          </div>

          <span class="px-3 py-1 rounded-full text-xs font-medium ${pillClass(w.verification_status)}">
            ${label(w.verification_status)}
          </span>
        </div>

        <div class="mt-4 flex flex-wrap gap-2">
          <button
            data-id="${w.id}"
            data-status="Verified"
            class="px-4 py-2 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-medium hover:opacity-90 transition"
          >
            Verify
          </button>

          <button
            data-id="${w.id}"
            data-status="Pending"
            class="px-4 py-2 rounded-2xl border border-white/10 bg-white/10 text-white text-sm font-medium hover:bg-white/15 transition"
          >
            Pending
          </button>

          <button
            data-id="${w.id}"
            data-status="Rejected"
            class="px-4 py-2 rounded-2xl bg-rose-500/80 text-white text-sm font-medium hover:bg-rose-500 transition"
          >
            Reject
          </button>
        </div>
      </div>
    `;
  });
}

async function loadWorkers() {
  try {
    const response = await fetch("/workers");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const workers = await response.json();
    renderWorkers(workers);
  } catch (err) {
    console.error(err);
    verifyList.innerHTML = `
      <div class="col-span-full text-center py-10">
        <p class="text-rose-300 font-medium">Could not load workers.</p>
      </div>
    `;
  }
}

verifyList.addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  try {
    const response = await fetch(`/verify_worker/${btn.dataset.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status: btn.dataset.status })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to update worker status");
    }

    await loadWorkers();
  } catch (err) {
    console.error(err);
    alert(err.message || "Could not update worker status");
  }
});

loadWorkers();