import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import type { CreateNotePayload } from "../../services/noteService";

interface NoteFormProps {
  onCancel?: () => void;
  onSubmit: (values: CreateNotePayload) => void;
}

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  content: Yup.string().required("Content is required"),
  tag: Yup.string().required("Tag is required"),
});

const initialValues: CreateNotePayload = {
  title: "",
  content: "",
  tag: "Todo",
};

export default function NoteForm({ onCancel, onSubmit }: NoteFormProps) {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        onSubmit(values);
        resetForm();
        onCancel?.();
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

          <button type="submit">Create note</button>

          <button type="button" onClick={() => onCancel?.()}>
            Cancel
          </button>
        </Form>
      )}
    </Formik>
  );
}