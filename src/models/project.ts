// Project TYpe

export enum ProjectStatus {
  Active,
  Finished,
}
export class Project {
  constructor(
    public id: String,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}
