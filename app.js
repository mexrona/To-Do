const list = document.getElementById("list");
const input = document.getElementById("input");
const add = document.getElementById("add");
const filter = document.getElementById("filter");
const cancel = document.getElementById("cancel");
const messageMask = document.getElementById("message");
const messageText = document.getElementsByClassName("message__text")[0];
const okay = document.getElementById("okay");
const timer = document.getElementById("timer");
const start = document.getElementById("start");

let currentTask = null;
console.log("before", currentTask);

const alarm = {
    addLocalStorage(id, title) {
        if (!localStorage.getItem("alarm")) {
            localStorage.setItem(
                "alarm",
                JSON.stringify([
                    {id: id, isActive: false, time: 0, title: title},
                ])
            );
            return;
        }

        const copyOfAlarm = JSON.parse(localStorage.getItem("alarm"));
        copyOfAlarm.push({id: id, isActive: false, time: 0, title: title});
        localStorage.setItem("alarm", JSON.stringify(copyOfAlarm));
    },

    remind(aMessage) {
        console.log(aMessage);
        this.timeoutID = undefined;

        messageText.innerHTML = aMessage;
        messageMask.classList.add("show");
    },

    setup(time, title) {
        if (time === null) return;

        if (typeof this.timeoutID === "number") {
            this.cancel();
        }

        this.timeoutID = setTimeout(
            (msg) => {
                this.remind(msg);
            },
            time,
            title
        );
    },

    cancel() {
        clearTimeout(this.timeoutID);
    },
};

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
        span.id = task.id;
        span.classList.add("icon");
        span.classList.add("icon--reminder");

        if (localStorage.getItem("alarm")) {
            const copyOfAlarm = JSON.parse(localStorage.getItem("alarm"));
            copyOfAlarm.forEach((item) => {
                if (item.id === Number(span.id)) {
                    if (
                        item.isActive === true &&
                        !span.classList.contains("active")
                    ) {
                        span.classList.add("active");
                    }

                    if (
                        item.isActive === false &&
                        span.classList.contains("active")
                    ) {
                        span.classList.remove("active");
                    }
                }
            });
        }

        span.setAttribute("title", "Напомнить");

        span.addEventListener("click", function (event) {
            document.body.classList.add("no-scroll");
            document.getElementsByClassName("mask")[0].classList.add("show");

            currentTask = event.target.id;
            console.log("during", currentTask);
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
            data.forEach((task) => {
                alarm.addLocalStorage(task.id, task.title);
            });
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

add.addEventListener("click", function () {
    if (!input.value) return;

    const copyOfTasks = JSON.parse(localStorage.getItem("tasks"));
    copyOfTasks.unshift({
        id: copyOfTasks.length + 1,
        title: input.value,
        checked: false,
    });

    alarm.addLocalStorage(copyOfTasks.length, input.value);

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

cancel.addEventListener("click", function () {
    document.body.classList.remove("no-scroll");
    document.getElementsByClassName("mask")[0].classList.remove("show");
});

okay.addEventListener("click", function () {
    messageMask.classList.remove("show");
    messageText.innerHTML = "";
});

start.addEventListener("click", function () {
    if (timer.value <= 0) return;

    console.log(timer.value);

    document.body.classList.remove("no-scroll");
    document.getElementsByClassName("mask")[0].classList.remove("show");

    const copyOfAlarm = JSON.parse(localStorage.getItem("alarm"));
    copyOfAlarm.forEach((task) => {
        if (task.id === Number(currentTask)) {
            task.isActive = true;
            task.time = timer.value * 1000;
        }
    });
    localStorage.setItem("alarm", JSON.stringify(copyOfAlarm));
    console.log(typeof currentTask);
    console.log("action", currentTask);

    currentTask = null;
    console.log("after", currentTask);

    timer.value = "";

    location.reload();
});

/* const remindMessage = (message) => {
    messageText.innerHTML = message;
    messageMask.classList.add("show");
}; */

/* const timeoutId1 = setTimeout(() => {
    console.log("timeoutId1");
}, 3000);

const timeoutId2 = setTimeout(() => {
    console.log("timeoutId2");
}, 10000);

window.addEventListener("click", function () {
    clearTimeout(timeoutId2);
    console.log("clear timeoutId");
}); */
