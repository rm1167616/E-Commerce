import React, { useState, useRef, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';

const ProductDescriptionEditor = ({ value, onChange }) => {
  const [isVisualMode, setIsVisualMode] = useState(true);
  const [wordCount, setWordCount] = useState(0);
  const textareaRef = useRef(null);
  const editorRef = useRef(null);

  // Calculate word count
  useEffect(() => {
    if (value) {
      const words = value.trim() ? value.trim().split(/\s+/).length : 0;
      setWordCount(words);
    } else {
      setWordCount(0);
    }
  }, [value]);

  const handleAddMedia = () => {
    // Implement media upload functionality
    console.log('Add media clicked');
  };

  const toggleEditorMode = () => {
    setIsVisualMode(!isVisualMode);
  };

  const handleDescriptionChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div style={{
      marginTop: '20px',
      marginBottom: '0px',
      position: 'relative',
      minWidth: '255px',
      border: '0.8px solid rgb(195, 196, 199)',
      boxShadow: 'rgba(0, 0, 0, 0.04) 0px 1px 1px 0px',
      background: 'rgb(255, 255, 255)',
      padding: '0px',
      lineHeight: '13px',
      outline: 'rgb(60, 67, 74) none 0px'
    }}>
      {/* Editor Header */}
      <h2 style={{
        textWrap: 'balance',
        fontSize: '14px',
        padding: '8px 12px',
        margin: '0px',
        lineHeight: '19.6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '0.8px solid rgb(195, 196, 199)',
        color: 'rgb(29, 35, 39)',
        fontWeight: 600
      }}>
        <label style={{ verticalAlign: 'middle' }}>Product description</label>
      </h2>

      {/* Toolbar */}
      <div style={{
        position: 'relative',
        margin: '6px 12px 0px',
        outline: 'rgb(60, 67, 74) none 0px'
      }}>
        <div style={{
          position: 'absolute',
          top: '0px',
          width: '100%',
          zIndex: 1000,
          background: 'transparent',
          paddingTop: '0px',
          backgroundColor: 'transparent',
          borderBottom: '0.8px solid rgb(195, 196, 199)',
          outline: 'rgb(60, 67, 74) none 0px'
        }}>
          <div style={{ float: 'left', display: 'flex', alignItems: 'center' }}>
            <Button 
              variant="outline-secondary" 
              size="sm"
              onClick={handleAddMedia}
              style={{
                paddingLeft: '5px',
                marginRight: '5px',
                marginBottom: '4px',
                paddingRight: '7px',
                color: 'rgb(56, 88, 233)',
                borderColor: 'rgb(56, 88, 233)',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
                fontSize: '13px',
                fontWeight: 400,
                background: 'rgb(246, 247, 247)',
                lineHeight: '28px',
                minHeight: '30px',
                margin: '0px 5px 4px 0px',
                borderRadius: '3px',
                whiteSpace: 'nowrap'
              }}
            >
              Add Media
            </Button>
          </div>
          
          <div style={{ float: 'right' }}>
            <Button 
              variant={isVisualMode ? 'secondary' : 'outline-secondary'}
              size="sm"
              onClick={() => toggleEditorMode()}
              style={{
                float: 'left',
                position: 'relative',
                top: '1px',
                cursor: 'pointer',
                fontSize: '13px',
                lineHeight: '19px',
                height: '20px',
                margin: '5px 0px 0px 5px',
                padding: '3px 8px 4px',
                border: '1px solid rgb(220, 220, 222)',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
                fontWeight: 400
              }}
            >
              Visual
            </Button>
            
            <Button 
              variant={!isVisualMode ? 'secondary' : 'outline-secondary'}
              size="sm"
              onClick={() => toggleEditorMode()}
              style={{
                float: 'left',
                position: 'relative',
                top: '1px',
                background: isVisualMode ? 'rgb(240, 240, 241)' : 'rgb(227, 227, 227)',
                color: isVisualMode ? 'rgb(100, 105, 112)' : 'rgb(0, 0, 0)',
                cursor: 'pointer',
                fontSize: '13px',
                lineHeight: '19px',
                height: '20px',
                margin: '5px 0px 0px 5px',
                padding: '3px 8px 4px',
                border: '0.8px solid rgb(220, 220, 222)',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
                fontWeight: 400
              }}
            >
              Text
            </Button>
          </div>
        </div>

        {/* Editor Area */}
        <div style={{
          clear: 'both',
          border: '1px solid rgb(220, 220, 222)',
          borderBottom: '0px none rgb(60, 67, 74)',
          boxShadow: 'none',
          marginTop: '-1px',
          position: 'relative',
          outline: 'rgb(60, 67, 74) none 0px',
          background: 'rgb(255, 255, 255)'
        }}>
          {isVisualMode ? (
            <Form.Control
              as="textarea"
              ref={textareaRef}
              value={value}
              onChange={handleDescriptionChange}
              style={{
                height: '300px',
                width: '100%',
                border: 'none',
                padding: '10px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
                fontSize: '14px',
                lineHeight: '1.5',
                resize: 'vertical',
                boxShadow: 'none',
                outline: 'none'
              }}
              placeholder="Describe this product. What makes it unique? What are its most important features?"
            />
          ) : (
            <Form.Control
              as="textarea"
              ref={textareaRef}
              value={value}
              onChange={handleDescriptionChange}
              style={{
                height: '300px',
                width: '100%',
                border: 'none',
                padding: '10px',
                fontFamily: 'Consolas, Monaco, monospace',
                fontSize: '13px',
                lineHeight: '1.5',
                resize: 'vertical',
                boxShadow: 'none',
                outline: 'none',
                backgroundColor: 'rgb(253, 253, 253)'
              }}
            />
          )}
        </div>
      </div>

      {/* Status Bar */}
      <table role="presentation" style={{
        margin: '0px 12px 12px',
        width: 'calc(100% - 24px)',
        border: '0.8px solid rgb(195, 196, 199)',
        borderSpacing: '0px 0px',
        backgroundColor: 'rgb(246, 247, 247)',
        boxShadow: 'rgba(0, 0, 0, 0.04) 0px 1px 1px 0px',
        zIndex: 999
      }}>
        <tbody>
          <tr>
            <td style={{
              padding: '2px 10px',
              fontSize: '12px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
              fontWeight: 400,
              lineHeight: '12px'
            }}>
              Word count: <span>{wordCount}</span>
            </td>
            <td style={{
              padding: '2px 10px',
              textAlign: 'right',
              fontSize: '12px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
              fontWeight: 400,
              lineHeight: '12px'
            }}>
              <span>&nbsp;</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ProductDescriptionEditor;