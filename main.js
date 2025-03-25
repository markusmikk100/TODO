const tasks = [
    {
        id: 1,
        name: 'Task 1',
        completed: false
    },
    {
        id: 2,
        name: 'Task 2',
        completed: true
    }
];
let lastTaskId = 2;
/////////////////////////////
let taskList;
let addTask;

// kui leht on brauseris laetud siis lisame esimesed taskid lehele
window.addEventListener('load', () => {
    taskList = document.querySelector('#task-list');
    addTask = document.querySelector('#add-task');

    tasks.forEach(renderTask);

    // kui nuppu vajutatakse siis lisatakse uus task
    addTask.addEventListener('click', () => {
        const task = createTask(); // Teeme kõigepealt lokaalsesse "andmebaasi" uue taski
        const taskRow = createTaskRow(task); // Teeme uue taski HTML elementi mille saaks lehe peale listi lisada
        taskList.appendChild(taskRow); // Lisame taski lehele
    });
});

function renderTask(task) {
    const taskRow = createTaskRow(task);
    taskList.appendChild(taskRow);
}

//function createTask() {
//    lastTaskId++;
//   const task = {
//        id: lastTaskId,
//        name: 'Task ' + lastTaskId,
//        completed: false
//    };
//    tasks.push(task);
//    return task;
//}


let cookie = "XZqSL1M9YhGPLCMcW1hnGU5v5hpmP9ej"

async function createTask(title, desc)
 {
    lastTaskId++;
    const res = await
fetch("https://demo2.z-bit.ee/tasks", {
    method: "POST",
    headers: {
        "Content-Type":
        "application/json",
        Authorization: `Bearer ${cookie}`,
    },
    body: JSON.stringify({
        title: 'Task ' + lastTaskId,
        desc: 'Something',
    }),
});
    const data = await res.json()
    console.log('Task created:', data);

}

function createTaskRow(task) {
    let taskRow = document.querySelector('[data-template="task-row"]').cloneNode(true);
    taskRow.removeAttribute('data-template');

    // Täidame vormi väljad andmetega
    const name = taskRow.querySelector("[name='name']");
    name.value = task.name;

    const checkbox = taskRow.querySelector("[name='completed']");
    checkbox.checked = task.completed;

    const deleteButton = taskRow.querySelector('.delete-task');
    deleteButton.addEventListener('click', () => {
        taskList.removeChild(taskRow);
        tasks.splice(tasks.indexOf(task), 1);
    });

    // Valmistame checkboxi ette vajutamiseks
    hydrateAntCheckboxes(taskRow);

    return taskRow;
}


function createAntCheckbox() {
    const checkbox = document.querySelector('[data-template="ant-checkbox"]').cloneNode(true);
    checkbox.removeAttribute('data-template');
    hydrateAntCheckboxes(checkbox);
    return checkbox;
}

/**
 * See funktsioon aitab lisada eridisainiga checkboxile vajalikud event listenerid
 * @param {HTMLElement} element Checkboxi wrapper element või konteiner element mis sisaldab mitut checkboxi
 */
function hydrateAntCheckboxes(element) {
    const elements = element.querySelectorAll('.ant-checkbox-wrapper');
    for (let i = 0; i < elements.length; i++) {
        let wrapper = elements[i];

        // Kui element on juba töödeldud siis jäta vahele
        if (wrapper.__hydrated)
            continue;
        wrapper.__hydrated = true;


        const checkbox = wrapper.querySelector('.ant-checkbox');

        // Kontrollime kas checkbox peaks juba olema checked, see on ainult erikujundusega checkboxi jaoks
        const input = wrapper.querySelector('.ant-checkbox-input');
        if (input.checked) {
            checkbox.classList.add('ant-checkbox-checked');
        }
        
        // Kui inputi peale vajutatakse siis uuendatakse checkboxi kujundust
        input.addEventListener('change', () => {
            checkbox.classList.toggle('ant-checkbox-checked');
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