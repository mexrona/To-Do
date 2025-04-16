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

        span.addEventListener("click", function () {
            document.body.classList.add("no-scroll");
            document.getElementsByClassName("mask")[0].classList.add("show");
        });

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

const createTasks = (flag, type, data) => {
    data.forEach((task) => {
        createTask(flag, task);
    });

    localStorage.setItem(type, JSON.stringify(data));
};

if (
    !localStorage.getItem("tasks") &&
    !localStorage.getItem("completed") &&
    !localStorage.getItem("uncompleted")
) {
    fetch("https://jsonplaceholder.typicode.com/todos")
        .then((response) => response.json())
        .then((data) => {
            createTasks(true, "tasks", data);
        });
}

if (
    localStorage.getItem("tasks") &&
    !localStorage.getItem("completed") &&
    !localStorage.getItem("uncompleted")
) {
    const copyOfTasks = JSON.parse(localStorage.getItem("tasks"));
    createTasks(false, "tasks", copyOfTasks);
}

if (localStorage.getItem("tasks") && localStorage.getItem("completed")) {
    const copyOfFilter = JSON.parse(localStorage.getItem("completed"));
    createTasks(false, "completed", copyOfFilter);
}

if (localStorage.getItem("tasks") && localStorage.getItem("uncompleted")) {
    const copyOfFilter = JSON.parse(localStorage.getItem("uncompleted"));
    createTasks(false, "uncompleted", copyOfFilter);
}

const input = document.getElementById("input");
const add = document.getElementById("add");

add.addEventListener("click", function () {
    if (!input.value) {
        return;
    }

    const copyOfTasks = JSON.parse(localStorage.getItem("tasks"));
    copyOfTasks.unshift({
        id: copyOfTasks.length + 1,
        title: input.value,
        checked: false,
    });

    location.reload();

    if (localStorage.getItem("uncompleted")) {
        const copyOfFilter = JSON.parse(localStorage.getItem("uncompleted"));
        copyOfFilter.unshift({
            id: copyOfTasks.length + 1,
            title: input.value,
            checked: false,
        });
        localStorage.setItem("uncompleted", JSON.stringify(copyOfFilter));
    }

    localStorage.setItem("tasks", JSON.stringify(copyOfTasks));
});

var deleteTask = (title) => {
    const copyOfTasks = JSON.parse(localStorage.getItem("tasks"));
    const newTasks = copyOfTasks.filter((task) => task.title !== title);
    location.reload();
    localStorage.setItem("tasks", JSON.stringify(newTasks));

    if (localStorage.getItem("completed")) {
        const copyOfFilter = JSON.parse(localStorage.getItem("completed"));
        const newFilter = copyOfFilter.filter((task) => task.title !== title);
        location.reload();
        localStorage.setItem("completed", JSON.stringify(newFilter));
    }

    if (localStorage.getItem("uncompleted")) {
        const copyOfFilter = JSON.parse(localStorage.getItem("uncompleted"));
        const newFilter = copyOfFilter.filter((task) => task.title !== title);
        location.reload();
        localStorage.setItem("uncompleted", JSON.stringify(newFilter));
    }
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

const filter = document.getElementById("filter");

filter.addEventListener("change", function () {
    const copyOfTasks = JSON.parse(localStorage.getItem("tasks"));
    let filteredTasks = [];

    if (filter.value === "completed") {
        copyOfTasks.forEach((task) => {
            if (task.checked === true) {
                filteredTasks.push(task);
            }
        });
        location.reload();
        localStorage.setItem("completed", JSON.stringify(filteredTasks));
        localStorage.removeItem("uncompleted");

        return;
    }

    if (filter.value === "uncompleted") {
        copyOfTasks.forEach((task) => {
            if (task.checked === false) {
                filteredTasks.push(task);
            }
        });
        location.reload();
        localStorage.setItem("uncompleted", JSON.stringify(filteredTasks));
        localStorage.removeItem("completed");
        return;
    }

    location.reload();
    localStorage.removeItem("completed");
    localStorage.removeItem("uncompleted");
});

const cancel = document.getElementById("cancel");
cancel.addEventListener("click", function () {
    document.body.classList.remove("no-scroll");
    document.getElementsByClassName("mask")[0].classList.remove("show");
});

const messageMask = document.getElementById("message");
const messageText = document.getElementsByClassName("message__text")[0];
const okay = document.getElementById("okay");

const remindMessage = (message) => {
    messageText.innerHTML = message;
    messageMask.classList.add("show");
};

okay.addEventListener("click", function () {
    messageMask.classList.remove("show");
    messageText.innerHTML = "";
});

const timer = document.getElementById("timer");
const start = document.getElementById("start");

const createTimer = (time) => {
    setTimeout(() => {
        remindMessage("Hello world!");
    }, time * 1000);
};

start.addEventListener("click", function () {
    if (timer.value > 0) {
        document.body.classList.remove("no-scroll");
        document.getElementsByClassName("mask")[0].classList.remove("show");
        createTimer(timer.value);
        timer.value = "";
    }
});
