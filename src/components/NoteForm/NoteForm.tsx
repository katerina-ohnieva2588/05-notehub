import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../services/noteService";

import type { CreateNotePayload } from "../../services/noteService";

interface NoteFormProps {
  onCancel?: () => void;
}

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Min 3 characters")
    .max(50, "Max 50 characters")
    .required("Title is required"),

  content: Yup.string()
    .max(500, "Max 500 characters")
    .notRequired(),

  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required("Tag is required"),
});

const initialValues: CreateNotePayload = {
  title: "",
  content: "",
  tag: "Todo",
};

export default function NoteForm({ onCancel }: NoteFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onCancel?.();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, { resetForm }) => {
        try {
          await mutation.mutateAsync(values);
          resetForm();
        } catch (error) {
          console.error(error);
        }
      }}
    >
      {() => (
        <Form>
          <div>
            <label>Title</label>
            <Field name="title" />
            <ErrorMessage name="title" component="div" />
          </div>

          <div>
            <label>Content</label>
            <Field name="content" as="textarea" />
            <ErrorMessage name="content" component="div" />
          </div>

          <div>
            <label>Tag</label>
            <Field name="tag" as="select">
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage name="tag" component="div" />
          </div>

          <button type="submit" disabled={mutation.isPending}>
            Create note
          </button>

          <button type="button" onClick={() => onCancel?.()}>
            Cancel
          </button>
        </Form>
      )}
    </Formik>
  );
}
