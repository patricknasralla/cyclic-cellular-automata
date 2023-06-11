import { style } from '@vanilla-extract/css';

export const uiContainer = style({
  display:       'flex',
  flexDirection: 'column',
  position:      'absolute',
  top:           '25px',
  left:          '25px',
  width:         '200px',
  padding:       '10px',
  zIndex:        1000,
});

const dropdown = style({
  padding:         '10px',
  display:         'flex',
  flexDirection:   'column',
  marginTop:       '10px',
  transition:      'all .4s cubic-bezier(0.68, -0.6, 0.32, 1.6)',
  transformOrigin: 'top',
  gap:             '5px',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  borderRadius:    '5px',
});

export const dropdownOpen = style([dropdown, {
  opacity: 1,
}]);

export const dropdownClosed = style([dropdown, {
  opacity:       0,
  transform:     'scaleY(0)',
  pointerEvents: 'none',
}]);

export const label = style({
  fontSize:   '12px',
  margin:     '5px 0 0 0',
  lineHeight: 0,
});
