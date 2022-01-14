import { createSlice, configureStore } from '@reduxjs/toolkit'

const appSlice = createSlice({
  name: 'counter',
  initialState: {
    notifications: {
        isOpen: false,
        type : 'success',
        message: ''
    },
    isRequest : true,
    dataLayout:null,
    documentDefinitions:null,

  },
  reducers: {
    setNotification: (state,action) => {
        return {
            ...state,
            notifications : action.payload
        }
    },
    setSpinner: (state,action) => {
      state.isRequest = action.payload
    },
    setDataLayoutAction: (state,action) => {
        state.dataLayout = action.payload
    },
    setDocumentDefinitionsAction: (state,action) => {
        state.documentDefinitions = action.payload
    }
  }
})

export const { setNotification, setSpinner,setDataLayoutAction,setDocumentDefinitionsAction } = appSlice.actions

const store = configureStore({
  reducer: appSlice.reducer
})

window.__store__ = store;
export default store
