import React from 'react';
import { CustomPicker } from 'react-color';
import './ColorPicker.css'

class ColorPicker extends React.Component {
  render() {
    return <div className='color-picker'>MyColorPicker</div>;
  }
}

export default CustomPicker(ColorPicker);