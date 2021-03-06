import React, { useState,Fragment,useEffect} from 'react'
import { Icon, Input } from 'antd'
import PropTypes from 'prop-types'
import './FileLists.less'
import useMenuFileList from '../../hooks/useMenuFileList'
import {getParentNode} from '../../../utils/domProcessing'

const FileLists = ({files,onFileClick,onSaveEditTitle,onFileDelete,pullCloudFile,uploadFile,activeFile_id}) => {
  /*
  * @files: original file data
  * @onFileClick: file click interaction
  * @onSaveEditTitle : file save interaction
  * @onFileDelete  : file delte interaction
 */
  // file edit status
  const [editStatus, setEditStatus] = useState('')
  // file data
  const [value, setValue] = useState('')
  // menu options
  const clickElement = useMenuFileList([
 {
    label: '拉取',
    click: () => {
      const getFileItem = getParentNode(clickElement, 'file-item')
      if(getFileItem) {
        const file_id = getFileItem.getAttribute('data-id')
        pullCloudFile(file_id)
      }
    }
  },{
    label:'上传',
    click: () => {
      const getFileItem = getParentNode(clickElement, 'file-item')
      if(getFileItem) {
        const file_id = getFileItem.getAttribute('data-id')
        uploadFile(file_id)
      }
    }
  },
  {
    type: 'separator'
  },{
    label:'云空间删除',
    click: () => {
      const getFileItem = getParentNode(clickElement, 'file-item')
      if(getFileItem) {
        const file_id = getFileItem.getAttribute('data-id')
        onFileDelete(file_id,true)
      }
    },
    accelerator: true
  },
  {
    label:'重命名',
    click: () => {
      const getFileItem = getParentNode(clickElement, 'file-item')
      if(getFileItem) {
        const file_id = getFileItem.getAttribute('data-id')
        setEditStatus(file_id)
      }
    }
  },{
    label:'删除',
    click: () => {
      const getFileItem = getParentNode(clickElement, 'file-item')
      if(getFileItem) {
        const file_id = getFileItem.getAttribute('data-id')
        onFileDelete(file_id)
      }
    }
  }],'.file-lists',[files])
  useEffect(() => {
    // if the file is new , must be set to edit  
    const newFile = files.find(file => file.isNew)
    if(newFile) {
      setEditStatus(newFile.id)
      // setValue(newFile.title)
    }
  },[files])
  return (
    <ul
    className="file-lists"
    style={
      {
        color: '#fff',
        overflow: 'auto',
        maxHeight: '100vh',
        marginBottom: '0px'
      }
    }>
     {
       files.map(file => (
        <li
        className={[(activeFile_id === file.id ? 'active file-item' : 'file-item')]}
        onClick={(e) => {
          (editStatus !== file.id) && onFileClick(file.id)
        }}
        key={file.id}
        data-id={file.id}
        data-title={file.title}
        >
          {
            (editStatus === file.id) && 
            <>  
              <div className="input-modal-global"
              onClick={(e) => {
                e.stopPropagation()
                onSaveEditTitle(file.id,value,file.isNew)
                setEditStatus('')
              }}></div>
              <Input defaultValue={ file.title ? file.title : '请输入文件名称'}  
                onChange={(e) => {
                  console.log(e.target.value)
                  setValue(e.target.value)
                }}
                onKeyDown={(e) => {
                  if(e.keyCode === 13) {
                    e.stopPropagation()
                    let newTitle = value.indexOf('.md') > 0 ? value : value + '.md'
                    onSaveEditTitle(file.id,newTitle,file.isNew)
                    setEditStatus('')
                  }
                }}
              />
            </>
          } 
          {
            (editStatus !== file.id) &&
            <Fragment>
              <Icon type="file-markdown" theme="filled"/>
              <b
              className="file-title"
              title={file.title}>
                {file.title}
              </b>
             {/* <Icon 
                onClick={(e) => {
                  e.stopPropagation()
                  onFileDelete(file.id)
                }}
                className="delete-icon" 
                type="delete" 
                theme="filled" 
                title='delete file'
                /> */}
              { /* 
              <Icon 
                className="click-icon"
                type="edit" 
                theme="filled" 
                title='rename'
                onClick={(e) => {
                  e.stopPropagation()
                  setEditStatus(file.id)
                }}
              /> */}
            </Fragment>
          }
         </li> 
       ))
     }
  </ul>
  )
}

FileLists.propTypes = {
  files: PropTypes.array,
  onFileClick: PropTypes.func,
  onSaveEditTitle: PropTypes.func,
  onFileDelete: PropTypes.func
}

export default FileLists