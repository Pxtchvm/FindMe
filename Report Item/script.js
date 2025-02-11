document.addEventListener("DOMContentLoaded", function () {
    const lostItemBtn = document.getElementById("lost-item-btn");
    const foundItemBtn = document.getElementById("found-item-btn");
    const form = document.getElementById("report-form");

    lostItemBtn.addEventListener("click", function () {
        lostItemBtn.classList.add("active");
        foundItemBtn.classList.remove("active");
        lostItemBtn.style.backgroundColor = "#007BFF";
        foundItemBtn.style.backgroundColor = "#ddd";
    });

    foundItemBtn.addEventListener("click", function () {
        foundItemBtn.classList.add("active");
        lostItemBtn.classList.remove("active");
        foundItemBtn.style.backgroundColor = "#007BFF";
        lostItemBtn.style.backgroundColor = "#ddd";
    });

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        
        const category = document.getElementById("category").value;
        const description = document.getElementById("description").value;
        const date = document.getElementById("date").value;
        const location = document.getElementById("location").value;
        const contact = document.getElementById("contact").value;

        if (!category || !description || !date || !location) {
            alert("Please fill out all required fields.");
            return;
        }

        alert("Item reported successfully!");
        form.reset();
    });

    document.getElementById("cancel").addEventListener("click", function () {
        form.reset();
    });
})