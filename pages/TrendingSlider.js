
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import YouTube from "react-youtube";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const opts = {
    height: "500",
    width: "900",
  };

const videos = [
  {
    id: '1',
    videoUrl:"jFME4dl84fA",
  },
  {
    id: '2',
    videoUrl:"w4mMF2UVXmY",
  },
  {
    id: '3',
    videoUrl:"KLbYAxQdjC8",
  },
  {
    id: '4',
    videoUrl:"bI41jWKPAmU",
  },
  {
    id: '5',
    videoUrl:"U40hJkNTNbM",
  },
  
];

function TrendingSlider() {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = videos.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  return (
    <Box style={{ flexGrow: 1,borderRadius:"0.5rem" }}>
      <AutoPlaySwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
      >
        {videos.map((step) => (
          <div key={step.id}>
            {Math.abs(activeStep - index) <= 2 ? (
              <YouTube videoId={step.videoUrl} opts={opts}/>
            ) : null}
          </div>
        ))}
      </AutoPlaySwipeableViews>
    </Box>
  );
}

export default TrendingSlider;
