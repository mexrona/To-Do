const list = document.getElementById("list");

const createTask = (flag, data, task) => {
    if (flag) {
        task.checked = false;
    }

    const item = document.createElement("div");
    item.classList.add("task");
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.setAttribute("type", "checkbox");

    if (task.checked === true) {
        input.setAttribute("checked", "checked");
    }

    input.addEventListener("change", function () {
        if (task.checked === false) {
            task.checked = true;
        } else {
            task.checked = false;
        }

        localStorage.setItem("tasks", JSON.stringify(data));
    });

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
};

const createTasks = (flag, data) => {
    data.forEach((task) => {
        createTask(flag, data, task);
    });

    localStorage.setItem("tasks", JSON.stringify(data));
};

if (!localStorage.getItem("tasks")) {
    fetch("https://jsonplaceholder.typicode.com/todos")
        .then((response) => response.json())
        .then((data) => {
            createTasks(true, data);
        });
} else {
    const copyOfTasks = JSON.parse(localStorage.getItem("tasks"));
    createTasks(false, copyOfTasks);
}

const input = document.getElementById("input");
const add = document.getElementById("add");

input.addEventListener("change", function () {});

add.addEventListener("click", function () {
    console.log("add");
    const copyOfTasks = JSON.parse(localStorage.getItem("tasks"));
    copyOfTasks.unshift({title: input.value, checked: false});
    location.reload();
    localStorage.setItem("tasks", JSON.stringify(copyOfTasks));
});
