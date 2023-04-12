import { createSlice } from "@reduxjs/toolkit";
import { IContactState, IState } from "../intrefaces";
import { nanoid } from "nanoid";
import { defaultContactList } from "./constants";

const name = "contact";
const initialState: IContactState = {
  list: defaultContactList,
};

const contactSlice = createSlice({
  initialState,
  name,
  reducers: {
    addContact: (state, { payload: { name, number, email,photo } }) => {
      const newContact = {
        id: nanoid(),
        name,
        number,
        email,
        photo
      };
      state.list = [...state.list, newContact];
    },
    updateContact: (state, { payload }) => {
      const newState = state.list.map((item) => {
        if (payload?.id === item.id) {
          return payload;
        }
        return item;
      });
      state.list = newState;
    },
    deleteContact: (state, { payload }) => {
      state.list = [
        ...state.list.filter((contact) => contact.id !== payload.id),
      ];
    },
  },
});
export const { addContact, updateContact, deleteContact } =
  contactSlice.actions;
export const selectContact = (state: IState) => state.contact.list;

export default contactSlice.reducer;
