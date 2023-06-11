import { style } from '@vanilla-extract/css';

export const mainContainer = style({
  position:        'absolute',
  top:             0,
  left:            0,
  display:         'flex',
  flexDirection:   'column',
  justifyContent:  'center',
  alignItems:      'center',
  backgroundColor: '#333',
  height:          '100%',
  width:           '100%',
});
