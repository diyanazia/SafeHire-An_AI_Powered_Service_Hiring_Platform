const transactionList = document.getElementById("transactionList");

function getStatusPillClass(status) {
  if (status.toLowerCase() === "completed") {
    return "bg-emerald-50 text-emerald-700 border-emerald-100";
  }
  if (status.toLowerCase() === "cancelled") {
    return "bg-rose-50 text-rose-700 border-rose-100";
  }
  return "bg-brand-50 text-brand-700 border-brand-100";
}
function getStatusLabel(status) {
  if (status === "completed") return "Completed";
  if (status === "cancelled") return "Cancelled";
  return "Assigned";
}
function renderTransactions(transactions) {
  transactionList.innerHTML = "";

  if (!Array.isArray(transactions) || transactions.length === 0) {
   transactionList.innerHTML = `
     <div class="col-span-full text-center py-10">
       <p class="text-slate-700 font-medium">No transactions yet.</p>
       <p class="text-sm text-slate-500 mt-1">Hiring records will appear here once a worker is hired.</p>
     </div>
  `;
  return;
}

transactions.forEach((tx) => {
  transactionList.innerHTML += `
    <div class="bg-white border border-[#E5E7EB] rounded-3xl p-5 transition hover:shadow-sm">
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="font-semibold">Employer: ${tx.employer_name}</p>
          <p class="text-sm text-slate-600 mt-1">Job: ${tx.job_title}</p>
          <p class="text-sm text-slate-600">Worker: ${tx.worker_name}</p>
          <p class="text-sm text-slate-600">Location: ${tx.location}</p>
        </div>
        <span class="px-3 py-1 rounded-full text-xs font-medium border ${getStatusPillClass(tx.status)}">
          ${getStatusLabel(tx.status)}
        </span>
      </div>
    </div>
   `;
 });
}
async function loadTransactions() {
  try {
    const response = await fetch("/transactions_api");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const transactions = await response.json();
    renderTransactions(transactions);
  } catch (error) {
    console.error("Error loading transactions:", error);
    transactionList.innerHTML = `
      <div class="col-span-full text-center py-10">
        <p class="text-rose-600 font-medium">Could not load transactions.</p>
      </div>
    `;
  }
}
loadTransactions();