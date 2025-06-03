const createBtn = document.getElementById("createBtn");
const newFolderInput = document.getElementById("newFolder");
const messageDiv = document.getElementById("message");

createBtn.addEventListener("click", async () => {
  const folderName = newFolderInput.value.trim();

  // Basic validation
  if (!folderName.match(/^[a-zA-Z0-9_-]+$/)) {
    messageDiv.textContent =
      "Folder name can only contain letters, numbers, hyphens, and underscores.";
    return;
  }
  messageDiv.textContent = "";

  try {
    const response = await fetch(
      `/php/make-folder.php?dir=${encodeURIComponent(folderName)}`,
      {
        method: "POST",
      },
    );

    const result = await response.json();

    if (result.success) {
      messageDiv.style.color = "green";
      messageDiv.textContent = `Folder '${folderName}' created successfully!`;
      // Optionally, add the new folder link to the list dynamically
      const folderContainer = document.getElementById("folder-container");
      const newLink = document.createElement("a");
      newLink.href = `pages/${folderName}.html`;
      newLink.textContent =
        folderName.charAt(0).toUpperCase() + folderName.slice(1);
      newLink.className =
        "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-center";
      folderContainer.appendChild(newLink);
      newFolderInput.value = "";
    } else {
      messageDiv.style.color = "red";
      messageDiv.textContent = `Error: ${result.error || "Unknown error"}`;
    }
  } catch (err) {
    messageDiv.style.color = "red";
    messageDiv.textContent = "Failed to create folder. Please try again.";
    console.error(err);
  }
});
