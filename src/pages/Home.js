import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Card, CardContent, CardActions, IconButton } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { styled } from '@mui/system';

const flashcards = [
  { question: "What is React?", answer: "A JavaScript library for building user interfaces." },
  { question: "What is a component?", answer: "An independent, reusable piece of UI." },
  { question: "What is JSX?", answer: "A syntax extension for JavaScript that looks similar to XML or HTML." },
];

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
  const [currentCard, setCurrentCard] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const handleNext = () => {
    setCurrentCard((prev) => (prev + 1) % flashcards.length);
    setFlipped(false);
  };

  const handlePrevious = () => {
    setCurrentCard((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    setFlipped(false);
  };

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Flashcards
          </Typography>
          <Button color="inherit">Add Card</Button>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
        }}
      >
        <IconButton onClick={handlePrevious} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <FlipCard flipped={flipped}>
          <Box className="card-inner">
            <Card className="card-front" sx={{ width: '100%', height: '100%' }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {flashcards[currentCard].question}
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
                  {flashcards[currentCard].answer}
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
        <IconButton onClick={handleNext} sx={{ ml: 2 }}>
          <ArrowForward />
        </IconButton>
      </Box>
    </>
  );
}

export default Home;
