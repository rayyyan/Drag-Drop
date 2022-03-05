console.log("Drag and drop")

//autobind Decorator

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
  @AutoBind
  private submitHandler(event: Event) {
    event.preventDefault()
    console.log(this.titleInputElement.value)
  }
  private configure() {
    this.element.addEventListener("submit", this.submitHandler)
  }
  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element)
  }
}

const projectInput = new ProjectInput()
