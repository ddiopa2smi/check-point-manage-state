export async function getListTasks() {
    const response = await fetch('/data/tasks.json');
    if (response.ok) return response.json();
    throw response;
}