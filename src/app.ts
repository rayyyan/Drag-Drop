console.log("Drag and drop")
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
  private submitHandler(event: Event) {
    event.preventDefault()
    alert("You just submited")
  }
  private configure() {
    this.element.addEventListener("submit", this.submitHandler)
  }
  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element)
  }
}

const projectInput = new ProjectInput()
