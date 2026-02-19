let projects = JSON.parse(localStorage.getItem("projects")) || [];

const projectList = document.getElementById("projectList");
const totalProjects = document.getElementById("totalProjects");
const completedProjects = document.getElementById("completedProjects");
const inProgressProjects = document.getElementById("inProgressProjects");
const successRate = document.getElementById("successRate");
const modal = document.getElementById("modal");
const projectForm = document.getElementById("projectForm");
const searchInput = document.getElementById("searchInput");

let currentFilter = "all";

function saveProjects(){
    localStorage.setItem("projects", JSON.stringify(projects));
}

function renderProjects(){
    projectList.innerHTML = "";
    let completed = 0;
    let filteredProjects = projects.filter(p => {
        if(currentFilter === "all") return true;
        if(currentFilter === "completed") return p.status === "Completed";
        if(currentFilter === "in-progress") return p.status === "In Progress";
    });

    const searchTerm = searchInput.value.toLowerCase();
    if(searchTerm){
        filteredProjects = filteredProjects.filter(p => p.name.toLowerCase().includes(searchTerm));
    }

    projects.forEach(p => {if(p.status === "Completed") completed++;});

    filteredProjects.forEach((project, index) => {
        const actualIndex = projects.indexOf(project);
        const card = document.createElement("div");
        card.className = `project-card ${project.status === "Completed" ? "completed" : ""}`;
        
        const dueDate = new Date(project.dueDate).toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'});
        
        card.innerHTML = `
            <div class="project-info">
                <h4>${project.name}</h4>
                <div class="project-meta">
                    <span class="status ${project.status === "Completed" ? "completed" : "in-progress"}">
                        ${project.status}
                    </span>
                    <span class="priority ${project.priority}">${project.priority.toUpperCase()}</span>
                    <span class="project-date">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        ${dueDate}
                    </span>
                </div>
            </div>
            <div class="actions">
                <button class="complete-btn" onclick="toggleStatus(${actualIndex})">
                    ${project.status === "Completed" ? "Reopen" : "Complete"}
                </button>
                <button class="delete-btn" onclick="deleteProject(${actualIndex})">Delete</button>
            </div>
        `;
        projectList.appendChild(card);
    });

    totalProjects.textContent = projects.length;
    completedProjects.textContent = completed;
    inProgressProjects.textContent = projects.length - completed;
    successRate.textContent = projects.length > 0 ? Math.round((completed/projects.length)*100) + "%" : "0%";
}

function addProject(){
    modal.classList.add("active");
    projectForm.reset();
    document.getElementById("projectDate").valueAsDate = new Date();
}

function closeModal(){
    modal.classList.remove("active");
}

projectForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("projectName").value;
    const priority = document.getElementById("projectPriority").value;
    const dueDate = document.getElementById("projectDate").value;
    
    projects.push({name, status:"In Progress", priority, dueDate});
    saveProjects();
    renderProjects();
    closeModal();
});

function toggleStatus(index){
    projects[index].status = projects[index].status === "Completed" ? "In Progress" : "Completed";
    saveProjects();
    renderProjects();
}

function deleteProject(index){
    if(confirm("Are you sure you want to delete this project?")){
        projects.splice(index,1);
        saveProjects();
        renderProjects();
    }
}

searchInput.addEventListener("input", renderProjects);

document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
        document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        currentFilter = tab.dataset.filter;
        renderProjects();
    });
});

modal.addEventListener("click", (e) => {
    if(e.target === modal) closeModal();
});

renderProjects();