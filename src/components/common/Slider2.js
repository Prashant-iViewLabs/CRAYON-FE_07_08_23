import React from 'react'
import { Grid, Box } from '@mui/material';
import { truncate } from "lodash";


import SmallButton from './SmallButton';
const Slider2 = ({ items, color, hideTagsAfter}) => {
    const remaining = (value) => {
        const remainingTags = items.slice(value, items.length)
        return remainingTags.join(", ");
    };
    return (

        <Box
            sx={{
                width: "100%",
                display: "flex",
                flexWrap: "wrap",
                // overflow: "hidden",
            }}
        >
            {items
                .filter((item) => item !== null)
                .map((item, index) => {
                    if (item !== undefined && index < hideTagsAfter) {
                        return (
                            <SmallButton
                                color={color}
                                height={25}
                                value={item}
                                label={truncate(item, { length: 15 })}
                                mr="4px"
                            />
                        );
                    } else if (items.length === index + 1) {
                        return (
                            <SmallButton
                                color={color}
                                height={25}
                                value={remaining(hideTagsAfter)}
                                label={`+ ${items.length - hideTagsAfter}`}
                                mr="4px"
                            />
                        );
                    }
                })}
        </Box>
    )
}

export default Slider2