"use strict";
document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("btn");
    button === null || button === void 0 ? void 0 : button.addEventListener("click", () => {
        alert("Hello from TypeScript!");
    });
});
