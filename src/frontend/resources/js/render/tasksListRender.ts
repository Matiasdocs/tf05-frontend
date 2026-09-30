import taskRender from "./taskRender";
import { tasksListApi } from "../api/tasksListApi";

export default async function tasksListRender(idUser: number, page = 1): Promise<void> {
  const container = document.querySelector("#tasks-container");

  if (!container) return;

  container.innerHTML = "";

  const ulElement = document.createElement("ul");
  ulElement.id = "tasks-list";
  ulElement.classList.add("list-group");

  container.append(ulElement);

  const listApi = await tasksListApi({ page });

  if (listApi.data.length === 0) {
    const emptyElement = document.createElement("li");
    emptyElement.classList.add("list-group-item", "text-center", "text-muted");
    emptyElement.innerText = "Nenhuma tarefa encontrada. Crie uma nova!";
    ulElement.append(emptyElement);
    return;
  }

  listApi.data.forEach((task) => {
    const liElement = taskRender(task, idUser);
    ulElement.append(liElement);
  });

  const totalPages = Math.ceil(listApi.total / listApi.limit);

  const paginationElement = document.createElement("div");
  paginationElement.classList.add("d-flex", "justify-content-between", "align-items-center", "mt-3");

  const previousButton = document.createElement("button");
  previousButton.classList.add("btn", "btn-secondary");
  previousButton.innerText = "Anterior";
  previousButton.disabled = page <= 1;

  previousButton.addEventListener("click", () => {
    void tasksListRender(idUser, page - 1);
  });

  const pageInfo = document.createElement("span");
  pageInfo.innerText = `Página ${page} de ${totalPages}`;

  const nextButton = document.createElement("button");
  nextButton.classList.add("btn", "btn-secondary");
  nextButton.innerText = "Próxima";
  nextButton.disabled = page >= totalPages;

  nextButton.addEventListener("click", () => {
    void tasksListRender(idUser, page + 1);
  });

  paginationElement.append(previousButton, pageInfo, nextButton);
  container.append(paginationElement);
}