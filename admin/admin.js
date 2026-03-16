const PASSWORD = "admin123"; // change this

function checkPassword() {
    const input = document.getElementById("passwordInput").value;

    if (input === PASSWORD) {
        document.getElementById("loginScreen").style.display = "none";
        document.getElementById("adminPanel").style.display = "block";
        loadRecords();
    } else {
        alert("Incorrect password.");
    }
}

function loadRecords() {

    cleanOldRecords();

    const recordsDiv = document.getElementById("recordsContainer");
    const todayLabel = document.getElementById("todayDate");

    recordsDiv.innerHTML = "";

    const today = new Date().toLocaleDateString("en-PH", { timeZone: "Asia/Manila" });
    todayLabel.textContent = "Today: " + today;

    let records = JSON.parse(localStorage.getItem("cafequeue_records")) || [];

    records.forEach(record => {

        const recordDate = new Date(record.timestamp).toLocaleDateString(
        "en-PH",
        { timeZone: "Asia/Manila" }
         );

        if (recordDate === today) {

            const box = document.createElement("div");
            box.classList.add("record-box");

            let content = `<strong>Time:</strong> ${record.dateTime}<br>`;

            record.items.forEach(item => {
                content += `- ${item.name} (₱${item.price})<br>`;
            });

            content += `<strong>Total:</strong> ₱${record.total}`;

            box.innerHTML = content;
            recordsDiv.appendChild(box);
        }
    });
}

function cleanOldRecords() {

    let records = JSON.parse(localStorage.getItem("cafequeue_records")) || [];

    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;

    records = records.filter(record => {
        return (now - record.timestamp) <= sevenDays;
    });

    localStorage.setItem("cafequeue_records", JSON.stringify(records));
}

function printToday() {
    window.print();
}