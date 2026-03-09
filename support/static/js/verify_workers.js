fetch("/workers")
  .then((r) => r.json())
  .then((workers) => {
    const box = document.getElementById("verifyList");
    box.innerHTML = "";

    const pillClass = (status) => {
      if (status === "Verified") return "bg-brand-50 text-brand-700 border-brand-100";
      if (status === "Rejected") return "bg-rose-50 text-rose-700 border-rose-100";
      return "bg-amber-50 text-amber-700 border-amber-100";
    };

    const label = (status) => {
      if (status === "Verified") return "✅ Verified";
      if (status === "Rejected") return "❌ Rejected";
      return "⏳ Pending";
    };

    workers.forEach((w) => {
      box.innerHTML += `
        <div class="bg-white border border-[#E5E7EB] rounded-3xl p-5 transition hover:shadow-sm">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="font-semibold">${w.name}</p>
              <p class="text-sm text-slate-600">NID: ${w.nid}</p>
              <p class="text-sm text-slate-600">Risk Score: ${w.risk_score}</p>
            </div>
            <span class="px-3 py-1 rounded-full text-xs font-medium border ${pillClass(w.verification_status)}">
              ${label(w.verification_status)}
            </span>
          </div>

          <div class="mt-4 flex flex-wrap gap-2">
            <button data-id="${w.id}" data-status="Verified"
              class="px-3 py-2 rounded-2xl bg-brand-500 text-white text-sm hover:bg-brand-600">
              Verify
            </button>

            <button data-id="${w.id}" data-status="Pending"
              class="px-3 py-2 rounded-2xl border border-[#E5E7EB] bg-white text-sm hover:bg-slate-50">
              Pending
            </button>

            <button data-id="${w.id}" data-status="Rejected"
              class="px-3 py-2 rounded-2xl bg-rose-500 text-white text-sm hover:bg-rose-600">
              Reject
            </button>
          </div>
        </div>
      `;
    });

    box.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;

      fetch(`/verify_worker/${btn.dataset.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: btn.dataset.status }),
      })
        .then((r) => r.json())
        .then(() => location.reload());
    });
  })
  .catch((err) => {
    console.error(err);
    document.getElementById("verifyList").innerHTML =
      `<div class="col-span-full text-center text-slate-600">Could not load workers.</div>`;
  });