import { taskUpdateApi } from "../api/taskUpdateApi";
import tasksListRender from "../render/tasksListRender";
import type { TaskListItemElement } from "../types/dom";

export default async function taskEditHandler(event: Event): Promise<void> {
  const buttonElement = event.currentTarget as HTMLButtonElement;
  const liElement = buttonElement.closest("li") as TaskListItemElement | null;

  if (!liElement) return;

  const { userId: idUser, taskId } = liElement;

  const existingInput =
    liElement.querySelector<HTMLInputElement>(".task-edit-input");

  if (!existingInput) {
    const nameElement =
      liElement.querySelector<HTMLSpanElement>(".task-name");

    if (!nameElement) return;

    const inputElement = document.createElement("input");

    inputElement.type = "text";
    inputElement.value = nameElement.innerText;
    inputElement.classList.add(
      "form-control",
      "form-control-sm",
      "flex-grow-1",
      "task-edit-input"
    );

    nameElement.replaceWith(inputElement);

    buttonElement.innerText = "Salvar";

    inputElement.focus();

    inputElement.addEventListener("keydown", (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === "Enter") {
        buttonElement.click();
      }
    });

    return;
  }

  const newName = existingInput.value.trim();

  if (!newName) {
    alert("Digite um nome para a tarefa.");
    return;
  }

  try {
    await taskUpdateApi(taskId, { name: newName });
    await tasksListRender(idUser);
  } catch (error) {
    alert("Erro ao editar tarefa");
    console.error(error);
  }
}