import {
  inputEnabled,
  setDiv,
  message,
  setToken,
  token,
  enableInput,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showAddEdit } from "./addEdit.js";

let testsDiv = null;
let testsTable = null;
let testsTableHeader = null;

export const handleTests = () => {
  testsDiv = document.getElementById("jobs");
  const logoff = document.getElementById("logoff");
  const addJob = document.getElementById("add-job");
  testsTable = document.getElementById("jobs-table");
  testsTableHeader = document.getElementById("jobs-table-header");

  testsDiv.addEventListener("click", (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addJob) {
        showAddEdit(null);
      } else if (e.target === logoff) {
        setToken(null);

        message.textContent = "You have been logged off.";

        // clear table but keep header row
        testsTable.replaceChildren(testsTableHeader);

        showLoginRegister();
      } else if (e.target.classList.contains("editButton")) {
        message.textContent = "";
        showAddEdit(e.target.dataset.id);
      }
    }
  });
};

export const showTests = async () => {
  try {
    enableInput(false);

    const response = await fetch("/api/v1/tests", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    let children = [testsTableHeader];

    if (response.status === 200) {
      if (data.count === 0) {
        // clear table but keep header row
        testsTable.replaceChildren(...children);
      } else {
        for (let i = 0; i < data.tests.length; i++) {
          const rowEntry = document.createElement("tr");

          const editButton = `<td><button type="button" class="editButton" data-id="${data.tests[i]._id}">edit</button></td>`;
          const deleteButton = `<td><button type="button" class="deleteButton" data-id="${data.tests[i]._id}">delete</button></td>`;

          const rowHTML = `
            <td>${data.tests[i].name}</td>
            <td>${data.tests[i].type}</td>
            <td>${data.tests[i].status}</td>
            ${editButton}
            ${deleteButton}
          `;

          rowEntry.innerHTML = rowHTML;
          children.push(rowEntry);
        }

        // replace all rows (header + data)
        testsTable.replaceChildren(...children);
      }
    } else {
      message.textContent = data.msg;
    }
  } catch (err) {
    console.log(err);
    message.textContent = "A communication error occurred.";
  }

  enableInput(true);
  setDiv(testsDiv);
};
