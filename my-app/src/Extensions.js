import React, { Component } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import Extension from './Extension';
import BuildIcon from '@material-ui/icons/Build';
import './tr.css';


class Extensions extends Component {

  handleDragEnd = (result) => {
    if (!result.destination) return

    // helper function to reorder result (src: react-beautiful-dnd docs)
    const reorder = (list, startIndex, endIndex) => {
      const result = Array.from(list)
      const [removed] = result.splice(startIndex, 1)
      result.splice(endIndex, 0, removed)
      return result
    }

    // perform reorder
    const lineItems = reorder(
      this.props.items,
      result.source.index,
      result.destination.index
    )

    // call parent handler with new state representation
    this.props.reorderHandler(lineItems)

  }

  render = () => {

    const {
        items,
        addHandler,
        changeHandler,
        focusHandler,
        deleteHandler,
        reorderHandler,
        products,
        data,
        readOnly,
        } = this.props

    return (
      <form>

        <div className='lineItems'>
          <div className='gridTable'>



            <DragDropContext onDragEnd={this.handleDragEnd}>
              <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    className= 'listDraggingOver'
                  >
                    {this.props.items.map((item, i) => (
                      <Draggable key={item.index} draggableId={item.index} index={i}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={provided.draggableProps.style}
                            className='listItemDragging'
                          >
                            <Extension
                              addHandler={addHandler}
                              changeHandler={changeHandler}
                              focusHandler={focusHandler}
                              deleteHandler={deleteHandler}
                              reorderHandler={reorderHandler}
                              data={data}
                              style={{color: 'red'}}
                              key={i + item.index}
                              index={i}
                              name={item.index}
                              label={item.label}
                              weight={item.weight}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
            </Droppable>
          </DragDropContext>

          </div>

          <div className='addItem'>
            <button type="button" onClick={addHandler}><BuildIcon size="1.25em" className='addIcon' /> Add Item</button>
          </div>

        </div>
      </form>

    )
  }
}

export default Extensions;
