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
        const loadingScreen = document.getElementById("loading-screen");
        const progressBar = document.getElementById("progress-bar");
        if (!container)
            return;
        container.innerHTML = "";
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
            // loading-screen logic
            let loadCount = 0;
            let totalToLoad = 0;
            const updateProgess = () => {
                if (!progressBar || totalToLoad === 0)
                    return;
                const progress = Math.min((loadCount / totalToLoad) * 100, 100);
                progressBar.style.width = `${progress}%`;
            };
            const checkDone = () => {
                updateProgess();
                if (loadCount == totalToLoad && loadingScreen) {
                    loadingScreen.style.display = "none";
                }
            };
            file.forEach((filename) => {
                var _a;
                const wrapper = document.createElement("div");
                wrapper.className = "flex flex-col items-center";
                const ext = ((_a = filename.split(".").pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || "";
                // Second wrapper that controls size of media element
                const mediaWrapper = document.createElement("div");
                mediaWrapper.className =
                    "w-72 h-40 flex flex-items overflow-hidden items-center justify-center bg-gray-200 rounded ";
                let mediaEl;
                const onLoad = () => {
                    loadCount++;
                    checkDone();
                };
                if (["jpg", "jpeg", "png", "gif", "svg", "ico"].includes(ext)) {
                    const img = document.createElement("img");
                    img.src = `/storage/${directory}/${filename}`;
                    img.alt = filename;
                    img.className =
                        "max-w-full max-h-full object-contain ml-1 mr-1 mt-2 mb-2 rounded"; // fit inside wrapper
                    const timeout = setTimeout(onLoad, 3000); // fallback after 3s
                    img.onload = () => {
                        clearTimeout(timeout);
                        onLoad();
                    };
                    img.onerror = () => {
                        clearTimeout(timeout);
                        onLoad();
                    };
                    totalToLoad++;
                    mediaWrapper.appendChild(img);
                    //
                }
                else if (["mp4", "webm"].includes(ext)) {
                    const video = document.createElement("video");
                    video.src = `/storage/${directory}/${filename}`;
                    video.controls = true;
                    video.className = "max-w-full max-h-full mb-4 rounded";
                    mediaWrapper.appendChild(video);
                    video.onloadeddata = onLoad;
                    video.onerror = onLoad;
                    totalToLoad++;
                    // Add player and logo
                }
                else if (["mp3", "wav"].includes(ext)) {
                    const audio = document.createElement("audio");
                    audio.src = `/storage/${directory}/${filename}`;
                    audio.controls = true;
                    mediaWrapper.className =
                        "w-72 h-40 flex flex-col overflow-hidden  items-center justify-end bg-gray-200 rounded shadow";
                    audio.onloadeddata = onLoad;
                    audio.onerror = onLoad;
                    totalToLoad++;
                    const musicLogo = document.createElement("img");
                    musicLogo.src = `/icons/music.svg`;
                    musicLogo.className = "w-16 h-16 mb-2";
                    mediaWrapper.appendChild(musicLogo);
                    mediaWrapper.appendChild(audio);
                    musicLogo.onload = onLoad;
                    musicLogo.onerror = onLoad;
                    totalToLoad++;
                    // Progammer files
                }
                else if (["asm", "wasm"].includes(ext)) {
                    const code = document.createElement("img");
                    code.src = `/icons/asm.svg`;
                    code.alt = filename;
                    code.className = "w-24 h-24 mt-4 mb-4 object-contain";
                    mediaWrapper.appendChild(code);
                    //
                }
                else if (["java", "jar"].includes(ext)) {
                    const code = document.createElement("img");
                    code.src = `/icons/java.svg`;
                    code.alt = filename;
                    code.className = "w-24 h-24 mt-4 mb-4 object-contain";
                    mediaWrapper.appendChild(code);
                    //
                }
                else if (["c", "cpp", "h", "hpp"].includes(ext)) {
                    const code = document.createElement("img");
                    code.src = `/icons/c.svg`;
                    code.alt = filename;
                    code.className = "w-24 h-24 mt-4 mb-4 object-contain";
                    mediaWrapper.appendChild(code);
                    //
                }
                else {
                    const fallback = document.createElement("div");
                    fallback.className = "text-5xl";
                    fallback.textContent = "📄";
                    mediaEl = fallback;
                    mediaWrapper.appendChild(fallback);
                }
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
                wrapper.appendChild(mediaWrapper);
                wrapper.appendChild(button);
                container.appendChild(wrapper);
                // container.appendChild(document.createElement("hr"));
            });
            if (totalToLoad === 0 && loadingScreen) {
                loadingScreen.style.display = "none";
            }
        }
        catch (err) {
            console.error(err);
            alert("Could not load images.");
            const loadingScreen = document.getElementById("loading-screen");
            if (loadingScreen)
                loadingScreen.style.display = "none";
        }
    });
}
loadImagesAndButtons();
