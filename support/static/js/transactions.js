function getStatusPillClass(status) {
  if (status === "completed") {
    return "bg-emerald-50 text-emerald-700 border-emerald-100";
  }
  if (status === "cancelled") {
    return "bg-rose-50 text-rose-700 border-rose-100";
  }
  return "bg-brand-50 text-brand-700 border-brand-100";
}

fetch("/transactions_api")
  .then((response) => response.json())
  .then((transactions) => {
    const container = document.getElementById("transactionList");
    container.innerHTML = "";

    if (!Array.isArray(transactions) || transactions.length === 0) {
      container.innerHTML = `
        <div class="col-span-full text-center py-10">
          <p class="text-slate-700 font-medium">No transactions yet.</p>
          <p class="text-sm text-slate-500 mt-1">Hiring records will appear here once a worker is hired.</p>
        </div>
      `;
      return;
    }

    transactions.forEach((tx) => {
      container.innerHTML += `
        <div class="bg-white border border-[#E5E7EB] rounded-3xl p-5 transition hover:shadow-sm">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="font-semibold">Employer: ${tx.employer_name}</p>
              <p class="text-sm text-slate-600 mt-1">Job ID: ${tx.job_id}</p>
              <p class="text-sm text-slate-600">Worker ID: ${tx.worker_id}</p>
            </div>
            <span class="px-3 py-1 rounded-full text-xs font-medium border ${getStatusPillClass(tx.status)}">
              ${tx.status}
            </span>
          </div>
        </div>
      `;
    });
  })
  .catch((error) => {
    console.error("Error loading transactions:", error);
    document.getElementById("transactionList").innerHTML = `
      <div class="col-span-full text-center py-10">
        <p class="text-rose-600 font-medium">Could not load transactions.</p>
      </div>
    `;
  });