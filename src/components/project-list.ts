import { AutoBind } from "../decorators/autobind.js"
import { DragTarget } from "../models/drag-drop.js"
import { Project, ProjectStatus } from "../models/project.js"
import { projectState, ProjectState } from "../state/project-state.js"
import { Component } from "./base-component.js"
import { ProjectItem } from "./project-item.js"

// ProjectList class
export class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget
{
  assignProjects: Project[]

  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`)

    this.assignProjects = []

    this.element.id = `${type}-projects`
    this.configure()
    this.renderContent()
  }
  @AutoBind
  dragOverHandler(event: DragEvent) {
    console.log(event.dataTransfer!.types)
    if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
      event.preventDefault()
      const listEl = this.element.querySelector("ul")
      listEl!.classList.add("droppable")
    }
  }
  @AutoBind
  dropHandler(event: DragEvent) {
    const prjId = event.dataTransfer!.getData("text/plain")
    projectState.moveProject(
      prjId,
      this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished
    )
  }
  @AutoBind
  dragLeaveHandler(_: DragEvent) {
    const listEl = this.element.querySelector("ul")
    listEl!.classList.remove("droppable")
  }
  configure() {
    this.element.addEventListener("dragover", this.dragOverHandler)
    this.element.addEventListener("dragleave", this.dragLeaveHandler)
    this.element.addEventListener("drop", this.dropHandler)

    projectState.addListener((projects: Project[]) => {
      const relevantProjects = projects.filter((project) => {
        if (this.type === "active") {
          return project.status === ProjectStatus.Active
        } else {
          return project.status === ProjectStatus.Finished
        }
      })
      this.assignProjects = relevantProjects
      this.renderProjects()
    })
  }
  renderContent() {
    const listId = `${this.type}-projects-list`
    this.element.querySelector("ul")!.id = listId
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS"
  }
  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement
    listEl.innerHTML = ""
    for (const projItem of this.assignProjects) {
      new ProjectItem(this.element.querySelector("ul")!.id, projItem)
    }
  }
}
