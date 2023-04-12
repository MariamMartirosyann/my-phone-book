export interface IContactState {
  list: IContact[];
}

export interface IEmail{
    id:string | number,
    value:string | number,
}
export interface INumber{
  id:string | number,
  value: number,
}

export interface IContact {
  id: string;
  name: string;
  email: IEmail[];
  number: INumber[];
  photo:any,
  photoFile?: File | null | string;
}
export interface IAddEditContact {
  id: string;
  name: string;
  email: IEmail[];
  number: INumber[];
  photo:string,
  photoFile?: File | null | string;
}
export interface IFormData {
  name: string;
  email: IEmail[];
  number: INumber[];
  photo:string,
  photoFile: File | null | string;

}

export interface IState {
  contact: IContactState;
}
