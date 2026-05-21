import axios from "axios";
import type { Note, NoteTag } from "../types/note";

const token = import.meta.env.VITE_NOTEHUB_TOKEN;

export const api = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export type FetchNotesParams = {
  page: number;
  perPage: number;
  search?: string;
};

export type FetchNotesResponse = {
  notes: Note[];
  page: number;
  totalPages: number;
};

export const fetchNotes = async (params: FetchNotesParams) => {
  const { data } = await api.get<FetchNotesResponse>("/notes", {
    params: {
      page: params.page,
      perPage: params.perPage,
      ...(params.search && { search: params.search }),
    },
  });

  return data;
};

export type CreateNotePayload = {
  title: string;
  content: string;
  tag: NoteTag;
};

export const createNote = async (data: CreateNotePayload) => {
  const { data: result } = await api.post("/notes", data);

  return result;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await api.delete<Note>(`/notes/${id}`);

  return data;
};