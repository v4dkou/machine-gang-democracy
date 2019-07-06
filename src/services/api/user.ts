export class User {
  constructor(
    public id: number,
    public fullName: string,
    public avatarUrl: string,
    public pushToken: string,
  ) {}
}
