import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Card, CardContent, CardActions, IconButton, TextField } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { styled } from '@mui/system';
import axios from 'axios';

import { useNavigate } from "react-router-dom";

// Styled component for the flip animation
const FlipCard = styled(Box)(({ flipped }) => ({
  perspective: '1000px',
  width: '100%',
  maxWidth: 400,
  textAlign: 'center',
  '& .card-inner': {
    position: 'relative',
    width: '100%',
    height: 200,
    transformStyle: 'preserve-3d',
    transition: 'transform 0.6s',
    transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
  },
  '& .card-front, & .card-back': {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
  },
  '& .card-back': {
    transform: 'rotateY(180deg)',
  },
}));

function Home() {
  const [data, setData] = useState([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [aiResponse, setAiResponse] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8081/data')
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.log(err));
  }, []);

  const handleNext = () => {
    setCurrentCard((prev) => (prev + 1) % data.length);
    setFlipped(false);
  };

  const handlePrevious = () => {
    setCurrentCard((prev) => (prev - 1 + data.length) % data.length);
    setFlipped(false);
  };

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  const handleEdit = () => {
    navigate("/AddCard");
  };

  const handleAskAI = async () => {
    const currentQuestion = data[currentCard].Question; // Get the current question
    try {
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyAlqtsqYFNCa1KLD8xSexO3VsjHp0kRHFI",
        method: "post",
        data: {
          contents: [
            { parts: [{ text: `${currentQuestion}. Give the output in 100 words` }] }
          ]
        }
      });
      const aiText = response.data.candidates[0].content.parts[0].text;
      setAiResponse(aiText); // Update the state with AI response
    } catch (error) {
      console.error('Error fetching AI response:', error);
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Flashcards
          </Typography>
          <Button color="inherit" onClick={handleEdit}>Edit Data</Button>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '10vh',
          marginTop: 2,
          marginBottom: 4,
        }}
      >
        <Typography variant="h4" component="div">
          Answer Them
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '70vh',
        }}
      >
        <IconButton onClick={handlePrevious} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        {data.length > 0 && (
          <FlipCard flipped={flipped}>
            <Box className="card-inner">
              <Card className="card-front" sx={{ width: '100%', height: '100%' }}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {data[currentCard].Question}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={handleFlip}>
                    Answer
                  </Button>
                </CardActions>
              </Card>
              <Card className="card-back" sx={{ width: '100%', height: '100%' }}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {data[currentCard].Answer}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={handleFlip}>
                    Question
                  </Button>
                </CardActions>
              </Card>
            </Box>
          </FlipCard>
        )}
        <IconButton onClick={handleNext} sx={{ ml: 2 }}>
          <ArrowForward />
        </IconButton>

        <Button variant="contained" color="primary" onClick={handleAskAI}>
          ASK AI
        </Button>
        <TextField
          multiline
          rows={4}
          value={aiResponse}
          variant="outlined"
          sx={{ marginTop: 2, width: '100%', maxWidth: 600 }}
        />

      </Box>


    </>
  );
}

export default Home;
