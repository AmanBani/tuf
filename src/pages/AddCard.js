import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

const AddCard = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editedQuestion, setEditedQuestion] = useState('');
  const [editedAnswer, setEditedAnswer] = useState('');

  useEffect(() => {
    fetch('http://localhost:8081/data')
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id) => {
    // Implement delete functionality here
    console.log(`Delete card with id: ${id}`);
  };

  const handleOpenDialog = (index) => {
    setEditIndex(index);
    setEditedQuestion(data[index].Question);
    setEditedAnswer(data[index].Answer);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setEditIndex(null);
  };

  const handleUpdate = () => {
    // Implement update functionality here
    const updatedData = [...data];
    updatedData[editIndex] = { ...updatedData[editIndex], Question: editedQuestion, Answer: editedAnswer };
    setData(updatedData);
    handleCloseDialog();
    console.log(`Update card at index: ${editIndex}`);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Manage Flashcards
          </Typography>
          <Button color="inherit">Add Card</Button>
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
                  <IconButton onClick={() => handleOpenDialog(index)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(index)} color="secondary">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Update Dialog */}
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Update Flashcard</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Question"
            fullWidth
            variant="outlined"
            value={editedQuestion}
            onChange={(e) => setEditedQuestion(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Answer"
            fullWidth
            variant="outlined"
            value={editedAnswer}
            onChange={(e) => setEditedAnswer(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleUpdate}>Update</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddCard;
