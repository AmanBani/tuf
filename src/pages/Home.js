import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Card, CardContent, CardActions, IconButton } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { styled } from '@mui/system';

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
      </Box>
    </>
  );
}

export default Home;
