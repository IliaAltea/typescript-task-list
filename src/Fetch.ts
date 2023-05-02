export class Fetch {
  BASE_URL = "http://localhost:8000/tasks";
  static async getAll() {
    const response = await fetch("http://localhost:8000/tasks");
    if (!response.ok) {
      throw new Error(
        `Error al obtener las tareas: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();
    return data;
  }

  static async create(task: undefined) {
    const response = await fetch(`${this.BASE_URL}${task}`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
    if (!response.ok) {
      throw new Error(
        `Error al crear la tarea: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();
    return data;
  }
  static BASE_URL(BASE_URL: undefined, arg1: { method: string; headers: { "Content-Type": string; }; body: string; }) {
    throw new Error("Method not implemented.");
  }

  static async update(task:undefined) {
    const response = await fetch(`${this.BASE_URL}${task}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
    if (!response.ok) {
      throw new Error(
        `Error al actualizar la tarea: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();
    return data;
  }

  static async delete(id:undefined) {
    const response = await fetch(`${this.BASE_URL}${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(
        `Error al eliminar la tarea: ${response.status} ${response.statusText}`
      );
    }
  }
}
