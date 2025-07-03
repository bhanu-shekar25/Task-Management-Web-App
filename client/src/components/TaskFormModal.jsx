import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

const validationSchema = Yup.object({
  title: Yup.string().required('Required'),
  description: Yup.string(),
  dueDate: Yup.date(),
  priority: Yup.string().oneOf(['High', 'Medium', 'Low']).required('Required'),
  status: Yup.string().oneOf(['Pending', 'In Progress', 'Completed']).required('Required')
});

const TaskFormModal = ({ open, onClose, onSave }) => {
  const initialValues = {
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
    status: 'Pending'
  };

  const handleSubmit = (values) => {
    onSave(values);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create Task</DialogTitle>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ touched, errors }) => (
          <Form>
            <DialogContent>
              <Field as={TextField} name="title" label="Title" fullWidth margin="normal" helperText={touched.title && errors.title} error={Boolean(touched.title && errors.title)} />
              <Field as={TextField} name="description" label="Description" multiline rows={3} fullWidth margin="normal" />
              <Field as={TextField} name="dueDate" label="Due Date" type="date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
              <FormControl fullWidth margin="normal">
                <InputLabel>Priority</InputLabel>
                <Field as={Select} name="priority">
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                </Field>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Field as={Select} name="status">
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </Field>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>Cancel</Button>
              <Button type="submit" variant="contained">Save</Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default TaskFormModal;