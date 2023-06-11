import { style } from '@vanilla-extract/css';

export const gridContainer = style({
  backgroundColor: 'gray',
  border:          '1px solid black',
  padding:         '10px',
});

export const gridRow = style({
  display:    'block',
  margin:     0,
  padding:    0,
  lineHeight: 0,
});

export const gridCell = style({
  display: 'inline-block',
  height:  '10px',
  width:   '10px',
});
