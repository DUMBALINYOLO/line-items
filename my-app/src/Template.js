import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import {  Grid  } from "@material-ui/core";
import './styles.css';
import Button from '@material-ui/core/Button';
import Extensions from './Extensions';
import PrintIcon from '@material-ui/icons/Print';
import { uuid } from 'uuidv4';
import { TextField } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';





const styles = {
  whitePaper: {
    background: '#808000',
    color: 'SlateBlue',
    minWidth: 800,
    border: '1px solid #dedede'
  }
};





class VehicleTemplate extends React.Component {
  constructor(props){
    super(props);
    this.ws = new WebSocket('ws://localhost:9000/ws/weightData/');
    this.socketRef = null;
    this.state = {
        data: 0,
        name: '',
        model: '',
        plate_number: '',
        type: 'truck',
        wagons: [{ index: uuid(), label: '', type: 'once', weight: 0 }],
        total: 0,
      };
    this.onSubmit = this.onSubmit.bind(this);
    this.handleChange= this.handleChange.bind(this);
    this.handleChangeTable = this.handleChangeTable.bind(this);
    this.addNewRow = this.addNewRow.bind(this);
    this.deleteRow = this.deleteRow.bind(this);
    this.handleLineItemChange = this.handleLineItemChange.bind(this);
  }


  componentDidMount() {
    this.ws.onopen = () => {
        // on connecting, do nothing but log it to the console
        console.log('connected')
    }

    this.ws.onmessage = evt => {
        // listen to data sent from the websocket server
        // const message = JSON.parse(evt.data)
        const {data} = this.state;
        this.setState({data: evt.data})
        // this.setState({this.state.lines.weight: data})
    }

    this.ws.onclose = () => {
        console.log('disconnected')
        // automatically try to reconnect on connection loss
    }

  };


  onSubmit = (e) => {
    e.preventDefault();
    const {
      name,
      model,
      plate_number,
      type,
      wagons,

    } = this.state;

    const vehicle = {
      name,
      model,
      plate_number,
      type,
      wagons,
    };
    console.log(vehicle);
    this.setState({
      name: '',
      model: '',
      plate_number: '',
      wagons: [],
    });

  };



  handleLineItemChange = (elementIndex) => (event) => {
    let wagons = this.state.wagons.map((item, i) => {
      if (elementIndex !== i) return item
      return {...item, [event.target.name]: event.target.value}
    })
    this.setState({wagons})
  }



  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };





  handleChangeTable = (name, id) => event => {
    this.updateItem(id, { [name]: event.target.value });
  };



  addNewRow = (event) => {
    this.setState({
      wagons: this.state.wagons.concat(
        [{index: uuid(), label: '', type: 'once', weight: 0  }]
      )
    })
  }

  deleteRow = (index) => (event) => {
    this.setState({
      wagons: this.state.wagons.filter((item, i) => {
        return index !== i
      })
    })
  }



  handleReorderLineItems = (newLineItems) => {
    this.setState({
      wagons: newLineItems,
    })
  }

  clickOnDelete(record) {
      this.setState({
          wagons: this.state.lines.filter(r => r !== record)
      });
  }

  handleFocusSelect = (event) => {
    event.target.select()
  }

  calcLineItemsTotal = () => {
    return this.state.wagons.reduce((prev, cur) => (prev + cur.weight), '')
  }

  calcGrandTotal = () => {
    return this.calcLineItemsTotal()
  }

  render() {
    const { classes } = this.props;
    const {
      data,
      name,
      model,
      plate_number,
      wagons,

    } = this.state;

    return (
      <Paper elevation={0} >

          <form>
              <div style={{ clear: 'both' }} />
              <Grid container>
                <Grid item xs={6}>
                  <TextField
                      name="name"
                      label="Name"
                      value={name}
                      onChange={this.handleChange('name')}
                  />
                  <TextField
                      name="model"
                      label="MODEL"
                      value={model}
                      onChange={this.handleChange('model')}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                      name="plate_number"
                      label="PLATE NUMBER"
                      value={plate_number}
                      onChange={this.handleChange('plate_number')}
                  />
                </Grid>
              </Grid>
              <Extensions
                items={wagons}
                addHandler={this.addNewRow}
                changeHandler={this.handleLineItemChange}
                focusHandler={this.handleFocusSelect}
                deleteHandler={this.deleteRow}
                reorderHandler={this.handleReorderLineItems}
                data ={data}
              />
              <div className='valueTable'>
                <div className='row'>
                  <div className='label'>Subtotal</div>
                  <div className='value'>{this.calcLineItemsTotal()}KG</div>
                </div>
                <div className='row'>
                  <div className='label'>Total Due</div>
                  <div className='value'>{this.calcGrandTotal()}KG</div>
                </div>
              </div>
              <Button variant="contained" onClick={this.onSubmit}>SUBMIT</Button>

          </form>
      </Paper>
    );
  }
}


export default withStyles(styles) (VehicleTemplate);
