import React, { useState } from 'react';
import { Grid, Button, Typography } from '@mui/material';

const items = [
  { id: 1, content: 'Item 1 content' },
  { id: 2, content: 'Item 2 content' },
  { id: 3, content: 'Item 3 content' },
];

const GridDemo = () => {
  const [expandedItem, setExpandedItem] = useState(null);

  const handleItemClick = (itemId) => {
    setExpandedItem(itemId === expandedItem ? null : itemId);
  };

  return (
    <Grid container spacing={2}>
      {items.map((item) => (
        <Grid item key={item.id} xs={expandedItem === item.id ? 12 : 3}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => handleItemClick(item.id)}
          >
            Click Me
          </Button>
          {expandedItem === item.id ? (
            <Typography variant="body1">{item.content}</Typography>
          ) : 
          "default values"}
        </Grid>
      ))}
    </Grid>
  );
};

export default GridDemo;
