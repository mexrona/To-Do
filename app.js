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
            window.scrollTo(0, 0);
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

if (!localStorage.getItem("tasks") && !localStorage.getItem("filter")) {
    fetch("https://jsonplaceholder.typicode.com/todos")
        .then((response) => response.json())
        .then((data) => {
            createTasks(true, "tasks", data);
        });
}

if (localStorage.getItem("tasks") && !localStorage.getItem("filter")) {
    const copyOfTasks = JSON.parse(localStorage.getItem("tasks"));
    createTasks(false, "tasks", copyOfTasks);
}

if (localStorage.getItem("tasks") && localStorage.getItem("filter")) {
    const copyOfFilter = JSON.parse(localStorage.getItem("filter"));
    createTasks(false, "filter", copyOfFilter);
}

const input = document.getElementById("input");
const add = document.getElementById("add");

add.addEventListener("click", function () {
    if (!input.value) {
        return;
    }

    console.log("add");
    const copyOfTasks = JSON.parse(localStorage.getItem("tasks"));
    copyOfTasks.unshift({
        id: copyOfTasks.length + 1,
        title: input.value,
        checked: false,
    });
    location.reload();
    localStorage.setItem("tasks", JSON.stringify(copyOfTasks));
});

var deleteTask = (title) => {
    const copyOfTasks = JSON.parse(localStorage.getItem("tasks"));
    const newTasks = copyOfTasks.filter((task) => task.title !== title);
    location.reload();
    localStorage.setItem("tasks", JSON.stringify(newTasks));

    if (localStorage.getItem("filter")) {
        const copyOfFilter = JSON.parse(localStorage.getItem("filter"));
        const newFilter = copyOfFilter.filter((task) => task.title !== title);
        location.reload();
        localStorage.setItem("filter", JSON.stringify(newFilter));
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
        localStorage.setItem("filter", JSON.stringify(filteredTasks));
        return;
    }

    if (filter.value === "uncompleted") {
        copyOfTasks.forEach((task) => {
            if (task.checked === false) {
                filteredTasks.push(task);
            }
        });
        location.reload();
        localStorage.setItem("filter", JSON.stringify(filteredTasks));
        return;
    }

    location.reload();
    localStorage.removeItem("filter");
});

const cancel = document.getElementById("cancel");
cancel.addEventListener("click", function () {
    document.body.classList.remove("no-scroll");
    document.getElementsByClassName("mask")[0].classList.remove("show");
});
