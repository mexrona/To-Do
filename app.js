const list = document.getElementById("list");

const createTask = (flag, task) => {
    if (flag) {
        task.checked = false;
    }

    const item = document.createElement("div");
    item.classList.add("task");

    if (task.checked) {
        item.classList.add("checked");
    }

    const label = document.createElement("label");
    const input = document.createElement("input");
    input.setAttribute("type", "checkbox");

    if (task.checked === true) {
        input.setAttribute("checked", "checked");
    }

    input.addEventListener("change", function () {
        const title = task.title;

        if (task.checked === false) {
            task.checked = true;
            checkTask(true, title);
        } else {
            task.checked = false;
            checkTask(false, title);
        }
    });

    label.appendChild(input);
    item.appendChild(label);
    const title = document.createElement("span");
    title.innerHTML = task.title;
    item.appendChild(title);

    if (!task.checked) {
        const span = document.createElement("span");
        span.classList.add("icon");
        span.classList.add("icon--reminder");
        span.setAttribute("title", "Напомнить");
        item.appendChild(span);
    }

    const img = document.createElement("img");
    img.classList.add("icon");
    img.classList.add("icon--delete");
    img.setAttribute("src", "img/icons/delete.svg");
    img.setAttribute("title", "Удалить");

    img.addEventListener("click", function () {
        const title = task.title;
        deleteTask(title);
    });

    item.appendChild(img);
    list.appendChild(item);
};

const createTasks = (flag, data) => {
    data.forEach((task) => {
        createTask(flag, task);
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

add.addEventListener("click", function () {
    if (!input.value) {
        return;
    }

    console.log("add");
    const copyOfTasks = JSON.parse(localStorage.getItem("tasks"));
    copyOfTasks.unshift({title: input.value, checked: false});
    location.reload();
    localStorage.setItem("tasks", JSON.stringify(copyOfTasks));
});

var deleteTask = (title) => {
    const copyOfTasks = JSON.parse(localStorage.getItem("tasks"));
    const newTasks = copyOfTasks.filter((task) => task.title !== title);
    location.reload();
    localStorage.setItem("tasks", JSON.stringify(newTasks));
};

var checkTask = (flag, title) => {
    const copyOfTasks = JSON.parse(localStorage.getItem("tasks"));
    const newTasks = copyOfTasks.filter((task) => task.title !== title);
    const tasksToAdd = copyOfTasks.filter((task) => task.title === title);
    tasksToAdd.forEach((task) => {
        task.checked = flag;

        if (flag) {
            newTasks.push(task);
        } else {
            newTasks.unshift(task);
        }
    });
    location.reload();
    localStorage.setItem("tasks", JSON.stringify(newTasks));
};
