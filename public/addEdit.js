import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showTests } from "./tests.js";

let addEditDiv = null;
let company = null;
let position = null;
let status = null;
let addingJob = null;

export const handleAddEdit = () => {
  addEditDiv = document.getElementById("edit-job");
  company = document.getElementById("company");
  position = document.getElementById("position");
  status = document.getElementById("status");
  addingJob = document.getElementById("adding-job");
  const editCancel = document.getElementById("edit-cancel");
  const testsDiv = document.getElementById("jobs");

  addEditDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addingJob) {
        enableInput(false);

        let method = "POST";
        let url = "/api/v1/tests";

        if (addingJob.textContent.toLowerCase() === "update") {
          method = "PATCH";
          url = `/api/v1/tests/${addEditDiv.dataset.id}`;
        }

        try {
          const response = await fetch(url, {
            method,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: company.value,
              type: position.value,
              status: status.value,
            }),
          });

          const data = await response.json();

          if (response.status === 200 || response.status === 201) {
            message.textContent =
              response.status === 200
                ? "The entry was updated."
                : "The entry was created.";

            company.value = "";
            position.value = "";
            status.value = "Upcoming";

            showTests();
          } else {
            message.textContent = data.msg;
          }
        } catch (err) {
          console.log(err);
          message.textContent = "A communication error occurred.";
        }

        enableInput(true);
      } else if (e.target === editCancel) {
        message.textContent = "";
        showTests();
      }
    }
  });

  testsDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName == "BUTTON") {
      if (e.target.className !== "deleteButton") return;

      // Determines which entry to delete by its stored dataset.id
      const id = e.target.dataset.id;

      enableInput(false);

      try {
        const response = await fetch(`/api/v1/tests/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          message.textContent = "The entry was deleted.";
          showTests();
        } else {
          const data = await response.json();
          message.textContent = data.msg;
        }
      } catch (err) {
        console.log(err);
        message.textContent = "A communication error occurred.";
      }

      enableInput(true);
    }
  });
};

export const showAddEdit = async (jobId) => {
  if (!jobId) {
    company.value = "";
    position.value = "";
    status.value = "Upcoming";
    addingJob.textContent = "Add";
    message.textContent = "";
    delete addEditDiv.dataset.id;

    setDiv(addEditDiv);
    return;
  }

  enableInput(false);

  try {
    const response = await fetch(`/api/v1/tests/${jobId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.status === 200) {
      company.value = data.test.name;
      position.value = data.test.type;
      status.value = data.test.status;

      addingJob.textContent = "Update";
      message.textContent = "";
      addEditDiv.dataset.id = jobId;

      setDiv(addEditDiv);
    } else {
      message.textContent = "The entry was not found.";
      showTests();
    }
  } catch (err) {
    console.log(err);
    message.textContent = "A communication error occurred.";
    showTests();
  }

  enableInput(true);
};
