import { nanoid } from "nanoid";
import { IContact } from "../../intrefaces";

export const defaultContactList: IContact[] = [
  {
    id: nanoid(),
    name: "John Doe",
    email: [{ id: nanoid(), value: "k@mail.ru" }],
    number: [{ id: nanoid(), value: 7899512 }],
    photo: "postcards-1.jpg",
  },
  {
    id: nanoid(),
    name: "Johna Smitgh",
    email: [{ id: nanoid(), value: "Johna@mail.ru" }],
    number: [{ id: nanoid(), value: 8974123 }],
    photo: "1.jpg",
  },
];
