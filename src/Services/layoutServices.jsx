import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios';
import { Formik , Field  } from 'formik';
import * as Yup from "yup";
import './layoutStyle.css'
import { setSpinner,setDataLayoutAction,setDocumentDefinitionsAction ,setNotification } from './../store/index'
import { useSelector, useDispatch } from 'react-redux';

const setSpinnerState = (type) => {
  window.__store__.dispatch(setSpinner(type));
};

const baseURL = process.env.REACT_APP_BASE_URL;
const instance = axios.create({
  baseURL,
  timeout: 50000,
});
instance.interceptors.request.use(
  (config) => {
    setSpinnerState(true);
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => {
    setSpinnerState(false);
    return response;
  },
  (error) => {
    setSpinnerState(false);
    return Promise.reject(error);
  }
);

function LayoutServices(props) {
  const dispatch = useDispatch()
  const _dataLayout = useSelector((state) => state.dataLayout);
  const _documentDefinitions = useSelector((state) => state.documentDefinitions);
  const [allLayout, setAllLayout] = useState(null)
  const getListLayout = () => {
    instance.get(`modelling/layout`)
      .then(res => {
        let _data = res.data;
        dispatch(setDataLayoutAction(_data))
      })
      .catch(error => {
        dispatch(setDataLayoutAction(null))
      });
  }
  const getDocumentDefinitions = () => {
    instance.get(`modelling/document-definitions`)
      .then(res => {
        let _data = res.data;
        dispatch(setDocumentDefinitionsAction(_data))
      })
      .catch(error => {
        dispatch(setDocumentDefinitionsAction(null))
      });
  }
  const submitForm = (body) => {
    instance.post(`modelling/documents`,body)
      .then(res => {
        dispatch(setNotification({
          isOpen: true,
          type : 'success',
          message: 'success'
        }))
      })
      .catch(error => {
        dispatch(setDocumentDefinitionsAction(
          setNotification({
            isOpen: true,
            type : 'error',
            message: 'error'
          })
        ))
      });
  }
  useEffect(() => {
    getListLayout()
    getDocumentDefinitions()
  }, [])
  useEffect(() => {
    if(_dataLayout && _documentDefinitions){
      const {
        header : {
          rows : rowArray
        }
      } = _dataLayout
      const allLayout = rowArray.map(row=>
        row?.columns.map(cl=>{
          const dataCl = _documentDefinitions.schema?.fields.find(fd=>fd._id == cl.fieldId)
          return {
            ...cl,
            ...dataCl,
            typeCl: cl.type
          }
        })
      )
      setAllLayout(allLayout)
    }
  }, [_dataLayout,_documentDefinitions])

  const renderColumn = (
    {
      type,
      typeCl,
      fieldId,
      maxLength,
      name,
      label
    },
    {
      values,
      errors,
      touched,
      handleChange,
      handleBlur,
      handleSubmit,
      isSubmitting,
      /* and other goodies */
  }) => {
    switch (typeCl) {
      case 'field':
        if (type != 'boolean'){
          return (
            <div className="field-column" key={fieldId}>
              <label style={{marginRight:'5px'}}>{label}</label>
              <Field
                as="input"
                key={fieldId}
                type={type}
                name={fieldId}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values[fieldId]}
                maxLength={maxLength}
                className="field-input"
              ></Field>
            </div>
          )
          
        }
        else{
          return (
            <div key={fieldId} style={{marginRight:'30px'}}>
              <label style={{marginRight:'5px'}}>{label}</label>
              <Field 
                as="select"
                type={type}
                name={fieldId}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values[fieldId]}
                maxLength={maxLength}
                className="field-select"
              >
                <option value=''>Select Option</option>
                <option value={1}>True</option>
                <option value={2}>False</option>
              </Field>
            </div>
          )
          
        }
      case 'button':
        return (
          <button className="field-button" key={fieldId} type="submit">
            {label}
          </button>
        )
      default:
        break;
    }
  }
 
  const schemaForm = ()=>{
    const fields = ['cc4cb134-fda0-44d8-8e92-e42ebbceb415','228b905f-4a43-4a40-b829-0c6a04ad4782']
    const formSchema = fields.reduce(
      (obj, item) => ({ ...obj, [item]: Yup.string().required('Required') }),
      {}
    );
    return Yup.object(formSchema)
  }

  return (
    <div className = "wapper">
      <Formik
        initialValues={{}}
        validation = {schemaForm()}
        onSubmit={(values, { setSubmitting }) => {
          Object.entries(values).forEach(([id,value]) => {
            const typeCurrent = _documentDefinitions.schema.fields.find(fd=> fd._id == id)?.type
            if (typeCurrent == 'boolean'){
              values[id] = values[id] == '1'? true : false
            }
          });
          submitForm(values)
        }}
      >
        {(form) => (
          <form onSubmit={form.handleSubmit}>
            {
              allLayout?.map((row,i)=>
                (
                  <div key={i} className="field-row">
                    {
                       row.map(cl =>
                        renderColumn(cl,form)
                      )
                    }
                  </div>
                )
              )
            }
          </form>
        )}
      </Formik>
    </div> 
  )
}


export default LayoutServices

