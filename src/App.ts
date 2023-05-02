import { Fetch } from "./Fetch.js";

export class App {
  private alert:HTMLElement;
  private close:HTMLElement;
  private input:HTMLInputElement;
  private arrow:HTMLElement;
  private table:HTMLTableElement;
  private id: number = 1;
  private text:HTMLElement;
  constructor() {
    this.alert = document.querySelector(".alert") as HTMLElement;
    this.close = this.alert.firstElementChild as HTMLElement;
    this.input = document.querySelector("input") as HTMLInputElement;
    this.arrow = document.querySelector(".arrow") as HTMLElement;
    this.table = document.querySelector("table") as HTMLTableElement;
    this.text = document.querySelector("text:unknown") as HTMLElement;
  }
  init = async () => {
    //eventos
    //Cerrar la alerta en el botón con la X
    this.close.addEventListener("click", () => {
      this.alert.classList.add("dismissible");
    });
    //Impedir la recarga de la página y añadir una nueva tarea
    this.input.addEventListener("keydown", (e) => {
      if (e.code == "Enter" || e.code == "NumpadEnter") {
        e.preventDefault();
       this.addTask(this.input,this.id, this.input.value, this.alert);
      }
    });
    this.input.addEventListener("input", () => {
      if (this.input.value !== "" && !this.alert.classList.contains("dismissible")) {
        this.alert.classList.add("dismissible");
      }
    });
    //Añadir una nueva tarea
    this.arrow.addEventListener("click", () => {
      this.addTask(this.input, this.id, this.input.value, this.alert);
    });
    // Fetch all tasks
    let tasks = await Fetch.getAll();
    // Render all tasks
    this.renderTasks(tasks);
  };
  // //prepara una plantilla HTML, y la actualiza con contenido dinámico
 
  generateRow = (id: string, title: any, done: undefined) => {
    let newRow = document.createElement("tr");
    newRow.setAttribute("id", id);
    title = done ? `<del>${title}</del>` : title;
    newRow.innerHTML = `
<td>
  <i class="fa-solid fa-circle-check"></i>
  <span contenteditable="true" class="task">${title}</span>
</td>
<td>
  <span class="fa-stack fa-2x">
    <i class="fa-solid fa-square fa-stack-2x"></i>
    <i class="fa-solid fa-stack-1x fa-pencil fa-inverse"></i>
  </span>
</td>
<td>
  <span class="fa-stack fa-2x">
    <i class="fa-solid fa-square fa-stack-2x"></i>
    <i class="fa-solid fa-stack-1x fa-trash fa-inverse"></i>
  </span>
</td>
  `;
    //Tachar una tarea realizada
    
    newRow.firstElementChild?.firstElementChild?.addEventListener(
      "click",
      (e) => {
        this.crossOut(e);
      }
    );
    //Activar el modo edición desde la tarea
    newRow.firstElementChild?.lastElementChild?.addEventListener("focus", (e) => {
      this.editModeOn(e, true);
    });
    //Desactivar el modo edición
    newRow.firstElementChild?.lastElementChild?.addEventListener("blur", (e) => {
      this.editModeOff(e);
    });
    //Activar el modo edición desde el icono
    newRow.firstElementChild?.nextElementSibling?.firstElementChild?.lastElementChild?.addEventListener(
      "click",
      (e) => {
        this.editModeOn(e, false);
      }
    );
    //Eliminar la fila
    newRow.lastElementChild?.firstElementChild?.lastElementChild?.addEventListener(
      "click",
      (e) => {
        this.removeRow(e, false);
      }
    );
    return newRow;
  };
  renderTasks = (tasks: Array<{ id: number, title: string, done: undefined }>) => {
    console.log(tasks.length);
    tasks.forEach((task: { id: number, title: string, done: undefined }) => {
      this.table.appendChild(this.generateRow(task.id.toString(), task.title, task.done));
    });
  };
  // //Tachado de tareano 
  crossOut = (e: any) => {
    let task = e.target.nextElementSibling;
    let text = task.innerHTML;
    if (text.includes("<del>")) {
      text = task.firstElementChild.textContent;
      task.innerHTML = text;
      task.parentNode.parentNode.setAttribute("data-completed", "false");
    } else {
      task.innerHTML = `<del>${text}</del>`;
      task.parentNode.parentNode.setAttribute("data-completed", "true");
    }
  };
  //Añadir nueva tarea
  addTask = (input:HTMLInputElement, id:number, text:string, alert:HTMLElement) => {
    if (input.value.trim() === "") {
      input.value = "";
      alert.classList.remove("dismissible");
    } else {
      text = input.value;
      id =
        parseInt(
          document.querySelector("tbody")?.lastElementChild?.getAttribute("id") || "0"
        ) + 1 || 0;
      document.querySelector("tbody")?.appendChild(this.generateRow(id.toString(), text, undefined));
      input.value = "";
    }
  };
  //Modo Edición
  editModeOn = (e:Event, onFocus: boolean) => {
    let task:HTMLElement | null;
    if (onFocus) {
      task = e.currentTarget as HTMLElement;
    } else {
      task =
        (e.currentTarget as HTMLElement).parentNode?.parentNode?.previousSibling?.lastChild as HTMLElement;
          
      task.focus();
    }
    // console.log(task);
    task.classList.add("editable");
    document.addEventListener("keydown", (e) => {
      if (e.code == "Enter" || e.code == "NumpadEnter" || e.code == "Escape") {
        task?.blur();
      }
    });
  };
  editModeOff = (e:Event) => {
    let task = e.currentTarget as HTMLElement;
    if (task.innerHTML === "") {
      this.removeRow(e, true);
    } else {
      task.classList.remove("editable");
      task.innerHTML = this.clearWhitespaces(task.innerHTML);
      if (task.innerHTML === "") {
        this.removeRow(e, true);
      }
    }
  };
  //Eliminación de tarea
  removeRow = (e:Event, editionMode:boolean) => {
    const target = e.target as HTMLElement;
    if (editionMode) {
      (target.parentElement as HTMLElement)?.remove();
    } else {
      // console.log(e.target.parentNode.parentNode.parentNode);
     ((e.target as HTMLElement).parentElement?.parentElement?.parentElement as HTMLElement)?.remove();
    }
  };
  //Eliminación de espacios en blanco
  clearWhitespaces = (text:string) => {
    return text.replace(new RegExp(/&nbsp;/, "g"), "").trim();
  };
  idGenerator = () => {
   // generate random hex string
    return Math.floor(Math.random() * 16777215).toString(16);
  }
}