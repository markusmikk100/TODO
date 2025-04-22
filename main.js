let cookie = "XZqSL1M9YhGPLCMcW1hnGU5v5hpmP9ej";
let lastTaskId = 0;
let taskList;
let addTask;
const tasks = [];

window.addEventListener("load", () => {
	taskList = document.querySelector("#task-list");
	addTask = document.querySelector("#add-task");
	readTask();
	tasks.forEach(renderTask);

	addTask.addEventListener("click", async () => {
		try {
			const task = await createTask();
			const taskRow = createTaskRow({
				id: task.id,
				name: task.title,
				completed: task.marked_as_done ?? false,
			});
			taskList.appendChild(taskRow);
		} catch (error) {
			console.error("Error creating task:", error);
		}
	});
});

function renderTask(task) {
	const taskRow = createTaskRow(task);
	taskList.appendChild(taskRow);
}

async function createTask() {
	lastTaskId++;
	const res = await fetch("https://demo2.z-bit.ee/tasks", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${cookie}`,
		},
		body: JSON.stringify({
			title: "Task " + lastTaskId,
			desc: "Something",
		}),
	});
	if (!res.ok) throw new Error("Failed to create task");
	const data = await res.json();
	console.log("Task created:", data);
	return data;
}

async function readTask() {
	try {
		const response = await fetch(`https:/demo2.z-bit.ee/tasks`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${cookie}`,
			},
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		console.log("Tasks read:", data);

		while (taskList.firstChild) {
			taskList.removeChild(taskList.firstChild);
		}

		data.forEach((task) => {
			const taskRow = createTaskRow({
				id: task.id,
				name: task.title,
				completed: task.marked_as_done ?? false,
			});
			taskList.appendChild(taskRow);
		});
	} catch (error) {
		console.error("Error reading tasks:", error);
	}
}

async function updateTask(taskId, updatedTask) {
	try {
		const response = await fetch(`https://demo2.z-bit.ee/tasks/${taskId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${cookie}`,
			},
			body: JSON.stringify(updatedTask),
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		console.log("Task updated:", data);
	} catch (error) {
		console.error("Error updating task:", error);
	}
}

async function deleteTask(taskId) {
	const url = `https:/demo2.z-bit.ee/tasks/${taskId}`;
	const options = {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${cookie}`,
		},
	};

	try {
		const response = await fetch(url, options);
		if (!response.ok) throw new Error("Network response was not ok");
		console.log("Resource deleted successfully");
	} catch (error) {
		console.error("DELETE request failed:", error.message);
	}
}

function createTaskRow(task) {
	let taskRow = document
		.querySelector('[data-template="task-row"]')
		.cloneNode(true);
	taskRow.removeAttribute("data-template");

	console.log("Task id in createTaskRow:", task.id);

	const name = taskRow.querySelector("[name='name']");
	name.value = task.name;

	name.addEventListener("blur", async () => {
		const newTitle = name.value.trim();

		if (newTitle === task.name) return;

		try {
			await updateTask(task.id, { title: newTitle });
			task.name = newTitle;
			console.log(`Task ${task.id} title updated to "${newTitle}"`);
		} catch (error) {
			console.error("Error updating task title:", error);
		}
	});

	const checkbox = taskRow.querySelector("[name='completed']");
	checkbox.checked = task.completed;

	checkbox.addEventListener("change", async () => {
		task.completed = checkbox.checked;

		try {
			await updateTask(task.id, {
				marked_as_done: task.completed,
			});
			console.log(`Task ${task.id} updated with completed=${task.completed}`);
		} catch (error) {
			console.error("Error updating task status:", error);
		}
	});

	const deleteButton = taskRow.querySelector(".delete-task");
	deleteButton.addEventListener("click", () => {
		deleteTask(task.id);
		taskList.removeChild(taskRow);
		tasks.splice(tasks.indexOf(task), 1);
	});

	hydrateAntCheckboxes(taskRow);

	return taskRow;
}

function createAntCheckbox() {
	const checkbox = document
		.querySelector('[data-template="ant-checkbox"]')
		.cloneNode(true);
	checkbox.removeAttribute("data-template");
	hydrateAntCheckboxes(checkbox);
	return checkbox;
}

/**
 * See funktsioon aitab lisada eridisainiga checkboxile vajalikud event listenerid
 * @param {HTMLElement} element Checkboxi wrapper element või konteiner element mis sisaldab mitut checkboxi
 */
function hydrateAntCheckboxes(element) {
	const elements = element.querySelectorAll(".ant-checkbox-wrapper");
	for (let i = 0; i < elements.length; i++) {
		let wrapper = elements[i];

		// Kui element on juba töödeldud siis jäta vahele
		if (wrapper.__hydrated) continue;
		wrapper.__hydrated = true;

		const checkbox = wrapper.querySelector(".ant-checkbox");

		// Kontrollime kas checkbox peaks juba olema checked, see on ainult erikujundusega checkboxi jaoks
		const input = wrapper.querySelector(".ant-checkbox-input");
		if (input.checked) {
			checkbox.classList.add("ant-checkbox-checked");
		}

		// Kui inputi peale vajutatakse siis uuendatakse checkboxi kujundust
		input.addEventListener("change", () => {
			checkbox.classList.toggle("ant-checkbox-checked");
		});
	}
}

//    {
//        "username": "Tauri.Tammela@tptlive.ee",
//        "firstname": "Tauri",
//        "lastname": "Tammela",
//        "newPassword": "Password"
//    }
//
//
//    {
//        "id": 1039,
//        "username": "Tauri.Tammela@tptlive.ee",
//        "firstname": "Tauri",
//        "lastname": "Tammela",
//        "created_at": "2025-03-25 14:24:14",
//        "access_token": "XZqSL1M9YhGPLCMcW1hnGU5v5hpmP9ej"
//    }
