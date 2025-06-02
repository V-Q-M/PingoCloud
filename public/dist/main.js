"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function loadImagesAndButtons() {
    return __awaiter(this, void 0, void 0, function* () {
        const container = document.getElementById("download-container");
        if (!container)
            return;
        // Get the current HTML file name, e.g. "images.html"
        const currentFile = window.location.pathname.split("/").pop() || "";
        // Remove the ".html" extension to get directory name, e.g. "images"
        const directory = currentFile.replace(".html", "");
        console.log("Using directory:", directory);
        try {
            const res = yield fetch(`/php/list-files.php?dir=${encodeURIComponent(directory)}`);
            if (!res.ok)
                throw new Error("Failed to fetch image list");
            const file = yield res.json();
            file.forEach((filename) => {
                const wrapper = document.createElement("div");
                wrapper.className = "flex flex-col items-center";
                const img = document.createElement("img");
                img.src = `/storage/${directory}/${filename}`;
                img.alt = filename;
                img.className = "w-72 rounded shadow";
                const button = document.createElement("button");
                button.textContent = `${filename}`;
                button.className =
                    "mt-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700";
                button.onclick = () => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const response = yield fetch(`/php/download.php?dir=${encodeURIComponent(directory)}&file=${encodeURIComponent(filename)}`);
                        if (!response.ok)
                            throw new Error("Download failed");
                        const blob = yield response.blob();
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = filename;
                        a.click();
                        URL.revokeObjectURL(url);
                    }
                    catch (err) {
                        console.error(err);
                        alert("Download failed.");
                    }
                });
                // append image + button to wrapper
                wrapper.appendChild(img);
                wrapper.appendChild(button);
                container.appendChild(wrapper);
                // container.appendChild(document.createElement("hr"));
            });
        }
        catch (err) {
            console.error(err);
            alert("Could not load images.");
        }
    });
}
loadImagesAndButtons();
