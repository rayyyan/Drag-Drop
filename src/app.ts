console.log("Drag and drop")

// Project TYpe
enum ProjectStatus {
  Active,
  Finished,
}
class Project {
  constructor(
    public id: String,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

// Project State Management
type Listener = (items: Project[]) => void
class ProjectState {
  private listeners: Listener[] = []
  private projects: Project[] = []
  private static instance: ProjectState

  private constructor() {}

  static getInstance() {
    if (this.instance) {
      return this.instance
    }
    this.instance = new ProjectState()
    return this.instance
  }
  addListener(listenFn: Listener) {
    this.listeners.push(listenFn)
  }
  addProject(title: string, description: string, numberOfPeople: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      numberOfPeople,
      ProjectStatus.Active
    )
    this.projects.push(newProject)
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice())
    }
  }
}
const projectState = ProjectState.getInstance()

//Validation
interface Validatable {
  value: string | number
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
}
function validate(validatableInput: Validatable) {
  let isValid = true
  if (validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length !== 0
  }
  if (
    validatableInput.minLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid && validatableInput.value.length >= validatableInput.minLength
  }
  if (
    validatableInput.maxLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid && validatableInput.value.length <= validatableInput.maxLength
  }
  if (
    validatableInput.min != null &&
    typeof validatableInput.value === "number"
  ) {
    isValid = isValid && validatableInput.value >= validatableInput.min
  }
  if (
    validatableInput.max != null &&
    typeof validatableInput.value === "number"
  ) {
    isValid = isValid && validatableInput.value <= validatableInput.max
  }
  return isValid
}

//autoBind Decorator

function AutoBind(_: any, __: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this)
      return boundFn
    },
  }
  return adjDescriptor
}
// ProjectList class
class ProjectList {
  templateElement: HTMLTemplateElement
  hostElement: HTMLDivElement
  element: HTMLElement
  assignProjects: Project[]
  constructor(private type: "active" | "finished") {
    this.templateElement = document.getElementById(
      "project-list"
    ) as HTMLTemplateElement
    this.hostElement = document.getElementById("app") as HTMLDivElement
    this.assignProjects = []
    const importedNode = document.importNode(this.templateElement.content, true)
    this.element = importedNode.firstElementChild as HTMLElement
    this.element.id = `${this.type}-projects`
    projectState.addListener((projects: Project[]) => {
      this.assignProjects = projects
      this.renderProjects()
    })
    this.attach()
    this.renderContent()
  }
  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement
    for (const projItem of this.assignProjects) {
      const listItem = document.createElement("li")
      listItem.textContent = projItem.title

      listEl.appendChild(listItem)
    }
  }
  private renderContent() {
    const listId = `${this.type}-projects-list`
    this.element.querySelector("ul")!.id = listId
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS"
  }
  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element)
  }
}

// ProjectInput Class
class ProjectInput {
  templateElement: HTMLTemplateElement
  hostElement: HTMLDivElement
  element: HTMLFormElement
  titleInputElement: HTMLInputElement
  descriptionInputElement: HTMLTextAreaElement
  peopleInputElement: HTMLInputElement
  constructor() {
    this.templateElement = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement
    this.hostElement = document.getElementById("app")! as HTMLDivElement
    const importedNode = document.importNode(this.templateElement.content, true)
    this.element = importedNode.firstElementChild as HTMLFormElement
    this.element.id = "user-input"

    this.titleInputElement = this.element.querySelector(
      "#title"
    ) as HTMLInputElement
    this.descriptionInputElement = this.element.querySelector(
      "#description"
    ) as HTMLTextAreaElement
    this.peopleInputElement = this.element.querySelector(
      "#people"
    ) as HTMLInputElement
    this.configure()
    this.attach()
  }
  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value
    const enteredDescription = this.descriptionInputElement.value
    const enteredPeople = this.peopleInputElement.value

    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true,
    }
    const descriptionValidatable: Validatable = {
      value: enteredDescription,
      required: true,
    }
    const peopleValidatable: Validatable = {
      value: enteredPeople,
      required: true,
    }
    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable)
    ) {
      alert("Invalid input,please try again")
      return
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople]
    }
  }
  private clearInputs() {
    this.titleInputElement.value = ""
    this.descriptionInputElement.value = ""
    this.peopleInputElement.value = ""
  }
  @AutoBind
  private submitHandler(event: Event) {
    event.preventDefault()
    const userInput = this.gatherUserInput()
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput
      projectState.addProject(title, desc, people)
      this.clearInputs()
    }
  }
  private configure() {
    this.element.addEventListener("submit", this.submitHandler)
  }
  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element)
  }
}
const finishedProjectList = new ProjectList("finished")
const ActiveProjectList = new ProjectList("active")
const projectInput = new ProjectInput()
