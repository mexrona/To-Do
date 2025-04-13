const list = document.getElementById("list");

fetch("https://jsonplaceholder.typicode.com/todos")
    .then((response) => response.json())
    .then((data) => {
        data.forEach((task) => {
            task.checked = false;

            const item = document.createElement("div");
            item.classList.add("task");
            const label = document.createElement("label");
            const input = document.createElement("input");
            input.setAttribute("type", "checkbox");
            label.appendChild(input);
            item.appendChild(label);
            const title = document.createElement("span");
            title.innerHTML = task.title;
            item.appendChild(title);
            const span = document.createElement("span");
            span.classList.add("icon");
            span.classList.add("icon--reminder");
            span.setAttribute("title", "Напомнить");
            item.appendChild(span);
            const img = document.createElement("img");
            img.classList.add("icon");
            img.classList.add("icon--delete");
            img.setAttribute("src", "img/icons/delete.svg");
            img.setAttribute("title", "Удалить");
            item.appendChild(img);
            list.appendChild(item);
        });

        localStorage.setItem("tasks", JSON.stringify(data));
        checkCheckBox();
    });

var checkCheckBox = () => {
    const allCheckbox = document.querySelectorAll("input[type=checkbox]");
    const tasks = JSON.parse(localStorage.getItem("tasks"));

    for (let i = 0; i < allCheckbox.length; i++) {
        if (!allCheckbox[i].checked) {
            tasks[i].checked = false;
        } else {
            tasks[i].checked = true;
        }
    }

    localStorage.setItem("tasks", JSON.stringify(tasks));
};

window.addEventListener("onload", function () {
    checkCheckBox();
});
