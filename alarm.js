const alarm = {
    addLocalStorage() {
        if (!localStorage.getItem("alarm")) {
            localStorage.setItem("alarm", JSON.stringify([1]));
        }

        console.log(typeof JSON.parse(localStorage.getItem("alarm")));
        console.log(JSON.parse(localStorage.getItem("alarm")));
    },

    remind(aMessage) {
        console.log(aMessage);
        this.timeoutID = undefined;
    },

    setup() {
        if (typeof this.timeoutID === "number") {
            this.cancel();
        }

        this.timeoutID = setTimeout(
            (msg) => {
                this.remind(msg);
            },
            1000,
            "Wake up!"
        );
    },

    cancel() {
        clearTimeout(this.timeoutID);
    },
};
window.addEventListener("click", () => {
    alarm.addLocalStorage();
    alarm.setup();
});
