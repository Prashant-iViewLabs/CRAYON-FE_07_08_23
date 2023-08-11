import React, { useState } from 'react';
import { IconButton, Box } from '@mui/material';
import SmallButton from './SmallButton';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { truncate } from 'lodash';
import { nanoid } from '@reduxjs/toolkit';

const Slider = ({ items, theme, color }) => {
    return (
        <Box
            sx={
                {
                    // width: '80%',
                    display: 'flex', flexWrap: "wrap",
                    gap: 1
                }
            }
        >
            {items
                .filter((item) => item != null)
                .map((item, index) => {
                    if (item !== undefined) {
                        return (
                            <SmallButton
                                key={nanoid()}
                                color={color}
                                height={25}
                                value={item}
                                label={truncate(item, { length: 20 })}
                            />
                        );
                    }
                    return null; // Ensure you always return something in map
                })}
        </Box>
    );
};

export default Slider;
// import React, { useState } from 'react';
// import { IconButton, Box } from '@mui/material';
// import SmallButton from './SmallButton';
// import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
// import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
// import { truncate } from 'lodash';

// const Slider = ({ items, theme, color }) => {
//     const [arrSlider, setArrSlider] = useState(items);

//     const handleSliderClick = (direction) => {
//         const offset = direction === 'left' ? 1 : arrSlider.length - 1;
//         const newArrSlider = [
//             ...arrSlider.slice(offset),
//             ...arrSlider.slice(0, offset),
//         ];
//         setArrSlider(newArrSlider);
//     };

//     return (
//         <Box
//             minHeight={25}
//             sx={{
//                 display: 'flex',
//                 justifyContent: 'space-between'
//             }}
//         >
//             {arrSlider.length >= 3 && (
//                 <IconButton
//                     sx={{
//                         border: `1px solid ${theme.palette.grayBorder}`,
//                         borderRadius: '8px',
//                         width: '27px',
//                         height: '27px',
//                     }}
//                     color="redButton100"
//                     aria-label="search job"
//                     component="button"
//                     onClick={() => handleSliderClick('left')}
//                 >
//                     <KeyboardArrowLeftIcon />
//                 </IconButton>
//             )}
//             <Box
//                 sx={
//                     {
//                         // width: '80%',
//                         display: 'flex',
//                         overflow: 'hidden',
//                     }
//                 }
//             >
//                 {arrSlider
//                     .filter((item) => item != null)
//                     .map((item, index) => {
//                         if (item !== undefined) {
//                             return (
//                                 <SmallButton
//                                     color={color}
//                                     height={25}
//                                     value={item}
//                                     label={truncate(item, {length: 20})}
//                                     mr="4px"
//                                 />
//                             );
//                         }
//                         return null; // Ensure you always return something in map
//                     })}
//             </Box>
//             {arrSlider.length >= 3 && (
//                 <IconButton
//                     sx={{
//                         border: `1px solid ${theme.palette.grayBorder}`,
//                         borderRadius: '8px',
//                         width: '27px',
//                         height: '27px',
//                     }}
//                     color="redButton100"
//                     aria-label="search job"
//                     component="button"
//                     onClick={() => handleSliderClick('right')}
//                 >
//                     <KeyboardArrowRightIcon />
//                 </IconButton>
//             )}
//         </Box>
//     );
// };

// export default Slider;
