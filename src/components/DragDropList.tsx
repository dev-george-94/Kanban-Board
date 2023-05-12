import React, { useEffect } from 'react'
import { useState } from 'react'


// import { liveDataset,dataset,queries,appendData, deleteData, updateData } from './be/queries';


// react-beautiful-dnd //
  // Does not work with React.StrictMode
  import { DragDropContext, Droppable,Draggable,OnDragEndResponder, DropResult } from "react-beautiful-dnd"


// Typescript Intefaces/Types
    interface Item { text?:string }
    interface Column { header:string, items:Item[]}
    type List=Column[]

    

// Helper functions
  const object_DeepCopy=(obj:Object):any=>{
    return JSON.parse(JSON.stringify(obj))
  }



interface Props { 
  // query:Query<DocumentData> 
  query:Column[]
}
const DragDropList:React.FC<Props> = ({query}) => {

    // Initialize Datasource
    const [list, setList] = useState<List>([])
    useEffect(() => { 
      setList(query)
    }, [])

    const handleDragEnd:OnDragEndResponder=(result:DropResult) => {
      
      // Prevent Error if Draggable-Item is released on non-Droppable area
        if(!result.destination){return;}
  
        const { source, destination } = result;
  
      // Clone State - Test State Mutation by commenting in/out setList at the end of function
        //Does not mutate state
          const newList:List=object_DeepCopy(list)
  
        //Mutates state | Do not use
          // const newList:List ={...list}                       
  
  
      // Aliases for Source
        const src_column_idx:number=Number.parseInt(source.droppableId)
        const src_item_idx:number=source.index
  
      // Remove Items from Source column
        const removed_src_items:Item[]=
          newList[src_column_idx]
            .items
              .splice(src_item_idx,1)
  
  
      // Aliases for Destination
        const dest_column_idx:number=Number.parseInt(destination.droppableId)
        const dest_item_idx:number=destination.index
  
      // Add Items Removed from Source to the Destination
          newList[dest_column_idx]
            .items
              .splice(dest_item_idx,0,...removed_src_items)
  
      // Update State
        setList(newList)
  
    }
    
  
    return (
      <div className="app">
  
        <div className='drag-drop-list'>
          <DragDropContext onDragEnd={handleDragEnd}>
          
            {list.map((column,id)=>{
              // Column
              return (
                
                <div className="column" key={id}>
  
                  {/* Header */}
                  <h2 className='header'>{column.header}</h2>
  
                  {/* Body as Drop-Area for Draggable-Items */}
                  <div className='drop-area'>
                    <Droppable droppableId={id.toString()}>
                      
                      {(provided, snapshot)=>(
                        <div 
                          className={!snapshot.isDraggingOver ? "": "drag-over"}
                          ref={provided.innerRef}
                          {...provided.droppableProps} 
                        >
                          {
                            column.items.map((item:any,index)=>{
                              
                  
                              return (
                                // Draggable Item
                                <div className="drag-item" key={item.id}>
                                  <Draggable  draggableId={item.id.toString()} index={index}>
                                    {
                                      (provided,snapshot)=>{
                                        return (
                                        <div 
                                          ref={provided.innerRef} 
                                          {...provided.draggableProps} {...provided.dragHandleProps}
                                          style={{ ...provided.draggableProps.style}}
                                          className={!snapshot.isDragging ? "":"is-dragging"}
                                        >
                                          {item.text}
                                        </div>
                                        )
                                      }
                                    }
                                  </Draggable>
                                </div>
                              )
                            })
                          }
  
                          {provided.placeholder}
  
                        </div>
                      )}
                    </Droppable>
                  </div>
                  
                </div>
  
            )})}
      
          </DragDropContext>
        </div>
      
      
      </div>
  
    );
}

export default DragDropList