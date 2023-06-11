import './styles/UIMenuButton.css';

import { Button, Divider, Select, Slider } from 'antd';
import { ReactElement, useState } from 'react';

import { GPUDefaults } from '../lib/presentation-defaults';
import { NEIGHBOURHOOD } from '../model/model';
import { dropdownClosed, dropdownOpen, label, uiContainer } from './styles/UI.css';


interface Props {
  defaults:          GPUDefaults
  onStep:            () => void
  onReset:           () => void
  onStart:           () => void
  onUpdateThreshold: (threshold: number) => void
  onUpdateStates:    (states: number) => void
  onUpdateNSize:     (nSize: number) => void
  onUpdateNType:     (nType: NEIGHBOURHOOD) => void
  isRunning:         boolean
}

/**
 * The UI panel for the CCA.
 * Allows the user to control the CCA parameters in real time. And to start, stop, step and reset
 * the CCA.
 */
export function UIPanel(props: Props): ReactElement {
  const { defaults, isRunning, onStep, onReset, onStart, onUpdateThreshold,
    onUpdateStates, onUpdateNSize, onUpdateNType } = props;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownStyle = isMenuOpen ? dropdownOpen : dropdownClosed;

  return (
    <div className={uiContainer}>
      <UIMainMenuButton onClick={handleOpen} isMenuOpen={isMenuOpen} />
      <div className={dropdownStyle}>
        <Button type='primary' onClick={onStart}>{isRunning ? 'Stop' : 'Start' }</Button>
        <Button onClick={onReset}>Reset</Button>
        {!isRunning && <Button onClick={onStep}>Step</Button>}
        <Divider/>
        <div>
          <p className={label} >threshold</p>
          <Slider min={1} max={50} defaultValue={defaults.threshold} onAfterChange={onUpdateThreshold} />
        </div>
        <div>
          <p className={label}>states</p>
          <Slider min={2} max={50} defaultValue={defaults.states} onAfterChange={onUpdateStates} />
        </div>
        <div>
          <p className={label}>neighbourhood</p>
          <Slider min={1} max={10} defaultValue={defaults.nSize} onAfterChange={onUpdateNSize} />
          <Select
            defaultValue={defaults.neighbourhood ? NEIGHBOURHOOD.MOORE : NEIGHBOURHOOD.VON_NEUMANN}
            style={{ width: '100%' }}
            onChange={onUpdateNType}
            options={[
              { value: NEIGHBOURHOOD.MOORE, label: 'Moore' },
              { value: NEIGHBOURHOOD.VON_NEUMANN, label: 'Von Neumann' },
            ]}
          />
        </div>
      </div>
    </div>
  );

  function handleOpen(): void {
    setIsMenuOpen((prev) => !prev);
  }
}

interface MenuButtonProps {
  isMenuOpen: boolean
  onClick:    () => void
}

function UIMainMenuButton(props: MenuButtonProps): ReactElement {
  const { isMenuOpen, onClick } = props;
  const className = isMenuOpen ? 'main-menu main-menu-open' : 'main-menu main-menu-closed';

  return (
    <div className={className} onClick={onClick}>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
}
