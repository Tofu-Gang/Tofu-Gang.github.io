var clicked = null;
const panels = document.querySelectorAll(".panel");
const containers = document.querySelectorAll(".container");

panels.forEach((panel) => {
    panel.addEventListener("click", () => {
        clicked = panel;
    });
});

containers.forEach((container) => {
    container.addEventListener("click", () => {
        if(clicked.classList.contains("active")) {
            clicked.classList.remove("active");
        } else {
            container.querySelectorAll(".panel").forEach((panel) => {
                panel.classList.remove("active");
            });
            clicked.classList.add("active");
        }
    });
});
