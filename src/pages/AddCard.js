import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton,
  Dialog, DialogActions, DialogContent, DialogTitle, TextField
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import axios from 'axios';

const AddCard = () => {
  const [data, setData] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [values, setValues] = useState({
    Question: '',
    Answer: '',
  });

  useEffect(() => {
    fetch('http://localhost:8081/data')
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (question) => {
    axios.delete(`http://localhost:8081/data/${encodeURIComponent(question)}`)
      .then(res => {
        console.log(res);
        setData(data.filter(item => item.Question !== question));
      })
      .catch(err => console.log(err));
    console.log(`Delete card with question: ${question}`);
  };

  const handleOpenEditDialog = (index) => {
    setEditIndex(index);
    setValues({
      Question: data[index].Question,
      Answer: data[index].Answer,
    });
    setEditOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditOpen(false);
    setEditIndex(null);
  };

  const handleUpdate = (event) => {
    event.preventDefault();

    const originalQuestion = data[editIndex].Question;

    axios.put(`http://localhost:8081/data/${encodeURIComponent(originalQuestion)}`, values)
      .then(res => {
        console.log(res);

        const updatedData = [...data];
        updatedData[editIndex] = { ...values };
        setData(updatedData);

        handleCloseEditDialog();
        console.log(`Updated card with original question: ${originalQuestion}`);
      })
      .catch(err => console.log(err));
  };

  const handleOpenAddDialog = () => {
    setValues({
      Question: '',
      Answer: '',
    });
    setAddOpen(true);
  };

  const handleCloseAddDialog = () => {
    setAddOpen(false);
  };

  const handleSubmitNewCard = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8081/data', values)
      .then(res => {
        console.log(res);
        setData([...data, values]);
      })
      .catch(err => console.log(err));
    
    handleCloseAddDialog();
    console.log('Added new card:', values);
  };

  const handleValueChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Manage Flashcards
          </Typography>
          <Button color="inherit" onClick={handleOpenAddDialog}>Add Card</Button>
        </Toolbar>
      </AppBar>
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Question</TableCell>
              <TableCell>Answer</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.Question}</TableCell>
                <TableCell>{item.Answer}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenEditDialog(index)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(item.Question)} color="secondary">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Update Dialog */}
      <Dialog open={editOpen} onClose={handleCloseEditDialog}>
        <DialogTitle>Update Flashcard</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Question"
            fullWidth
            variant="outlined"
            name="Question"
            value={values.Question}
            onChange={handleValueChange}
          />
          <TextField
            margin="dense"
            label="Answer"
            fullWidth
            variant="outlined"
            name="Answer"
            value={values.Answer}
            onChange={handleValueChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleUpdate}>Update</Button>
        </DialogActions>
      </Dialog>

      {/* Add Card Dialog */}
      <Dialog open={addOpen} onClose={handleCloseAddDialog}>
        <DialogTitle>Add New Flashcard</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Question"
            fullWidth
            variant="outlined"
            name="Question"
            value={values.Question}
            onChange={handleValueChange}
          />
          <TextField
            margin="dense"
            label="Answer"
            fullWidth
            variant="outlined"
            name="Answer"
            value={values.Answer}
            onChange={handleValueChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Cancel</Button>
          <Button onClick={handleSubmitNewCard}>Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddCard;
