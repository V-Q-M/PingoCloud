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

      let mediaEl;

      if (["jpg", "jpeg", "png", "gif"].includes(ext)) {
        const img = document.createElement("img");
        img.src = `/storage/${directory}/${filename}`;
        img.alt = filename;
        img.className = "w-72 rounded shadow";
        mediaEl = img;
      } else if (["mp4", "webm"].includes(ext)) {
        const video = document.createElement("video");
        video.src = `/storage/${directory}/${filename}`;
        video.controls = true;
        video.className = "w-72 rounded shadow";
        mediaEl = video;
      } else if (["mp3", "wav"].includes(ext)) {
        const audio = document.createElement("audio");
        audio.src = `/storage/${directory}/${filename}`;
        audio.controls = true;
        mediaEl = audio;
      }
      //fallback
      if (!mediaEl) {
        console.warn("Skipping unsupported file:", filename);
        return;
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
      wrapper.appendChild(mediaEl);
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
