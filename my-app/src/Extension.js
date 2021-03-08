import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import BuildIcon from '@material-ui/icons/Build';
import './tr.css';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';



const Extension = props => {
    const { index, label, weight, data  } = props;
    const [readOnly, setReadOnly] = useState(true);
    const [zeight, setZeight] = useState(data);
    const [weightData, setWeightData] = useState(0);
    const [buttonState, setButtonState] = useState(false);
    const [value, setValue] = useState('');
    const [inputElement, setInputElement] = useState(null);






    const requestWeight = (index) => {
      props.changeHandler(index)
      let value = data;
      let weight = value;
      console.log(weight)
      setButtonState(true)
    }



    return (
      <div className='lineItem'>
          <div>{index + 1}</div>
          <TextField
                name="label"
                label="LABEL"
                value={label}
                onChange={props.changeHandler(index)}
          />

        <input
            className='currency'
            type='number'
            readOnly={true}
            value={weight}
            name='weight'
            />
          <div>
            <button type="button"
              className='requestItems'
              onClick={() => { requestWeight(index) }}
              disabled={buttonState}
            >REQUEST WEIGHT</button>
          </div>
          <div>
            <button type="button"
              className='deleteItem'
              onClick={props.deleteHandler(index)}
            ><BuildIcon size="1.25em" /></button>
          </div>
      </div>
    );
};

export default Extension
