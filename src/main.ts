async function loadImagesAndButtons() {
  const container = document.getElementById("download-container");
  if (!container) return;

  // Get the current HTML file name, e.g. "images.html"
  const currentFile = window.location.pathname.split("/").pop() || "";

  // Remove the ".html" extension to get directory name, e.g. "images"
  const directory = currentFile.replace(".html", "");

  console.log("Using directory:", directory);

  try {
    const res = await fetch(
      `/php/list-files.php?dir=${encodeURIComponent(directory)}`,
    );
    if (!res.ok) throw new Error("Failed to fetch image list");

    const file: string[] = await res.json();

    file.forEach((filename) => {
      const wrapper = document.createElement("div");
      wrapper.className = "flex flex-col items-center";

      const ext = filename.split(".").pop()?.toLowerCase() || "";

      // Second wrapper that controls size of media element
      const mediaWrapper = document.createElement("div");
      mediaWrapper.className =
        "w-72 h-40 flex flex-col overflow-hidden items-center justify-end bg-gray-200 rounded ";
      let mediaEl;

      if (["jpg", "jpeg", "png", "gif", "svg", "ico"].includes(ext)) {
        const img = document.createElement("img");
        img.src = `/storage/${directory}/${filename}`;
        img.alt = filename;
        img.className =
          "max-w-full max-h-full object-contain ml-1 mr-1 mt-2 mb-2 rounded"; // fit inside wrapper
        mediaWrapper.appendChild(img);
        //
      } else if (["mp4", "webm"].includes(ext)) {
        const video = document.createElement("video");
        video.src = `/storage/${directory}/${filename}`;
        video.controls = true;
        video.className = "max-w-full max-h-full mb-4 rounded";
        mediaWrapper.appendChild(video);
        // Add player and logo
      } else if (["mp3", "wav"].includes(ext)) {
        const audio = document.createElement("audio");
        audio.src = `/storage/${directory}/${filename}`;
        audio.controls = true;
        mediaWrapper.className =
          "w-72 h-40 flex flex-col overflow-hidden  items-center justify-end bg-gray-200 rounded shadow";
        const musicLogo = document.createElement("img");
        musicLogo.src = `/icons/music.svg`;
        musicLogo.className = "w-16 h-16 mb-2";
        mediaWrapper.appendChild(musicLogo);
        mediaWrapper.appendChild(audio);
        // Progammer files
      } else if (["asm", "wasm"].includes(ext)) {
        const code = document.createElement("img");
        code.src = `/icons/asm.svg`;
        code.alt = filename;
        code.className = "max-w-full max-h-full mb-2";
        mediaWrapper.appendChild(code);
        //
      } else if (["java", "jar"].includes(ext)) {
        const code = document.createElement("img");
        code.src = `/icons/java.svg`;
        code.alt = filename;
        code.className = "max-w-full max-h-full mb-2";
        mediaWrapper.appendChild(code);
        //
      } else if (["c", "cpp", "h", "hpp"].includes(ext)) {
        const code = document.createElement("img");
        code.src = `/icons/c.svg`;
        code.alt = filename;
        code.className = "max-w-full max-h-full mb-2";
        mediaWrapper.appendChild(code);
        //
      } else {
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
      button.onclick = async () => {
        try {
          const response = await fetch(
            `/php/download.php?dir=${encodeURIComponent(directory)}&file=${encodeURIComponent(filename)}`,
          );
          if (!response.ok) throw new Error("Download failed");

          const blob = await response.blob();
          const url = URL.createObjectURL(blob);

          const a = document.createElement("a");
          a.href = url;
          a.download = filename;
          a.click();
          URL.revokeObjectURL(url);
        } catch (err) {
          console.error(err);
          alert("Download failed.");
        }
      };

      // append image + button to wrapper
      wrapper.appendChild(mediaWrapper);
      wrapper.appendChild(button);

      container.appendChild(wrapper);
      // container.appendChild(document.createElement("hr"));
    });
  } catch (err) {
    console.error(err);
    alert("Could not load images.");
  }
}

loadImagesAndButtons();
