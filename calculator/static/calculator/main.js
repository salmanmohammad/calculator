function sendOperation(operation) {
    const num1 = document.getElementById("num1").value.trim();
    const num2 = document.getElementById("num2").value.trim();
    const resultEl = document.getElementById("result");
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    if (num1 === "" || num2 === "") {
        resultEl.innerText = "⚠️ Please enter both numbers before selecting an operation.";
        resultEl.classList.add("text-danger");
        return;
    }

    resultEl.classList.remove("text-danger");

    const formData = new FormData();
    formData.append('num1', num1);
    formData.append('num2', num2);
    formData.append('operation', operation);

    fetch("", {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRFToken': csrfToken,
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        resultEl.innerText = `Result: ${data.result}`;

        // Update history
        let historyList = "";
        data.history.forEach(item => {
            historyList += `<li class="list-group-item">${item}</li>`;
        });
        document.getElementById("history").innerHTML = historyList;
        document.querySelector(".clear_history_button").style.display = data.history.length ? "block" : "none";
    })
    .catch(() => {
        resultEl.innerText = "❌ Error calculating result.";
        resultEl.classList.add("text-danger");
    });
}


// handle clear history action
function clearHistory() {
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    fetch("", {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRFToken': csrfToken,
        },
        body: new URLSearchParams({ action: 'clear' })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("history").innerHTML = "";
        document.querySelector(".clear_history_button").style.display = "none";
    })
    .catch(() => {
        alert("Failed to clear history.");
    });
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}