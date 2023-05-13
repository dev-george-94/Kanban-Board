
import { db } from "./firebase-config"
import { 
  collection,
  getDocs,
  onSnapshot,                                 
  addDoc,                                     
  query,where,orderBy,DocumentData, Query, WhereFilterOp,
  writeBatch,
  setDoc,
  doc,
  getDoc
  
} from "firebase/firestore"


const limitPerRequest:number=500


// Data Retrieval - working as intended
export const liveDataset = (
  ss:React.Dispatch<React.SetStateAction<any[]>>,
  qry:Query<DocumentData>,
) => {
  onSnapshot(qry,(snapshot)=>{

    if(snapshot.docs.length){
      // Forces the columns to come in a set order so that they dont randomize on each row
      const emptyDoc={...snapshot.docs[0].data()}
      ss(
        snapshot.docs.map((doc)=>(
          { 
            id:doc.id, 
            ...emptyDoc,
            ...doc.data() 
          }
        ))
      )
    }

  })
}


export const dataset=(
  ss:React.Dispatch<React.SetStateAction<any[]>>,
  qry:Query<DocumentData>,
) => {
  getDocs(qry).then((snapshot)=>{
    if(snapshot.docs.length){
      // Forces the columns to come in a set order so that they dont randomize on each row
      const emptyDoc={...snapshot.docs[0].data()}
      ss(
        snapshot.docs.map((doc)=>{
          return (
            { 
              id:doc.id, 
              ...emptyDoc,
              ...doc.data() 
            }
          )
        })
      )
    }

  })
}



// Add Data
  export const appendData=(col:string,data:Object[])=>{

    // Unsure if this Transaction is Atomic | Research Later
    data.forEach((entry)=>{
      addDoc(
        collection(db,col),
        {...entry}
      )
    })



  }
  

  // Delete Data
  export const deleteData=(
    col:string,
    field:string,operator:WhereFilterOp,value:any
  )=>{
    
    const qry=query(
      collection(db,col),
      where(field,operator,value)
    )

    const batch=writeBatch(db)
      getDocs(qry).then((snapshot)=>{

        let currentRequestCount=0
        const LastDocIdx=snapshot.docs.length-1

        for(let i=0;i<=LastDocIdx;i++){
          
          const doc=snapshot.docs[i]
          batch.delete(doc.ref)

          currentRequestCount++;

          if( currentRequestCount === limitPerRequest || i===LastDocIdx){
            batch.commit();
            currentRequestCount=0;
          }

        }
          
      })
        
    }

    // Update Data
    export const updateData = (
      col:string,
      data:any,
      field:string,operator:WhereFilterOp,value:any
    )=>{
      const qry=query(
        collection(db,col),
        where(field,operator,value)
      )

      console.log(data)

    const batch=writeBatch(db)
      getDocs(qry).then((snapshot)=>{

        let currentRequestCount=0
        const LastDocIdx=snapshot.docs.length-1

        for(let i=0;i<=LastDocIdx;i++){
          
          const doc=snapshot.docs[i]
          batch.update(doc.ref,{
            ...doc.data(),
            ...data
          })

          currentRequestCount++;

          if( currentRequestCount === limitPerRequest || i===LastDocIdx){
            batch.commit();
            currentRequestCount=0;
          }

        }
          
      })


    }



// Queries
const qry_ToDo_List = query(
  collection(db,"todolist")
)

const qry_ToDo_Item = (id:string) => {

  return getDoc(doc(db,"todoitem",id)).then((item)=>{
    return {...item.data()}
  })

  
}


export const queries={
  qry_ToDo_List,
  qry_ToDo_Item
}




 