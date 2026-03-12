const transactionList = document.getElementById("transactionList");

function getStatusPillClass(status) {
  const value = (status || "").toLowerCase();

  if (value === "completed") {
    return "bg-emerald-500/20 text-emerald-300 border border-emerald-400/20";
  }
  if (value === "cancelled") {
    return "bg-rose-500/20 text-rose-300 border border-rose-400/20";
  }
  return "bg-pink-500/20 text-pink-300 border border-pink-400/20";
}

function getStatusLabel(status) {
  const value = (status || "").toLowerCase();

  if (value === "completed") return "Completed";
  if (value === "cancelled") return "Cancelled";
  return "Assigned";
}

function renderTransactions(transactions) {
  transactionList.innerHTML = "";

  if (!Array.isArray(transactions) || transactions.length === 0) {
    transactionList.innerHTML = `
      <div class="col-span-full text-center py-10">
        <p class="text-white font-medium">No transactions yet.</p>
        <p class="text-sm text-gray-300 mt-1">Hiring records will appear here once a worker is hired.</p>
      </div>
    `;
    return;
  }

  transactions.forEach((tx) => {
    transactionList.innerHTML += `
      <div class="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur transition hover:bg-white/10 hover:shadow-xl">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="font-semibold text-white">Employer: ${tx.employer_name}</p>
            <p class="text-sm text-gray-300 mt-1">Job: ${tx.job_title}</p>
            <p class="text-sm text-gray-300">Worker: ${tx.worker_name}</p>
            <p class="text-sm text-gray-300">Location: ${tx.location}</p>
          </div>

          <span class="px-3 py-1 rounded-full text-xs font-medium ${getStatusPillClass(tx.status)}">
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
        <p class="text-rose-300 font-medium">Could not load transactions.</p>
      </div>
    `;
  }
}

loadTransactions();