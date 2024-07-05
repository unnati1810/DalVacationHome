import React, { useState, useRef, useEffect } from 'react';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { styled } from '@mui/system';

AWS.config.update({
  region: 'us-east-1',
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:987020a2-47ef-41e4-bf80-11936c848edc',
  }),
});

const StyledButton = styled(Button)({
  backgroundColor: '#ff6f61',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#ff3b2e',
  },
  borderRadius: '8px',
  padding: '10px 20px',
  '& .MuiButton-label': {
    marginLeft: '8px', // Adjust the margin as needed
  },
});

const lexruntimev2 = new AWS.LexRuntimeV2();

// Generate or retrieve userId
let userId = sessionStorage.getItem('lexUserId');
if (!userId) {
  userId = uuidv4();
  sessionStorage.setItem('lexUserId', userId);
}

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [showChat, setShowChat] = useState(false); // State to manage chat visibility

  const messageEndRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom of messages on update
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;

    const newMessages = [...messages, { text: inputText, sender: 'user' }];
    setMessages(newMessages);

    const params = {
      botAliasId: 'DO7EE9W4VP',  // Replace with your Lex V2 bot alias ID
      botId: 'BVYSLWPTPD',  // Replace with your Lex V2 bot ID
      localeId: 'en_US',  // Replace with your bot locale ID
      sessionId: userId,
      text: inputText,
    };

    lexruntimev2.recognizeText(params, (err, data) => {
      if (err) {
        console.log(err, err.stack);
        return;
      }
      const botMessage = data.messages && data.messages.length > 0 ? data.messages[0].content : "I couldn't understand that.";
      setMessages([...newMessages, { text: botMessage, sender: 'bot' }]);
    });

    setInputText('');
  };

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  const closeChat = () => {
    setShowChat(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevents default behavior (submitting form)
      handleSendMessage();
    }
  };

  return (
    <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
      {!showChat && (
        // <Button
        //   variant="contained"
        //   color="primary"
        //   onClick={toggleChat}
        //   className="chat-button"
        // >

        // </Button>

        <StyledButton variant="contained" onClick={toggleChat}>
          <ChatBubbleOutlineIcon />
          Chat Now
        </StyledButton>
      )}
      {showChat && (
        <Paper sx={{ maxWidth: 400, width: '100%', p: 2 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" component="div">
              DalVacationHome Chatbot - Help
            </Typography>
            <Button onClick={closeChat}>
              <CloseIcon />
            </Button>
          </Box>
          <Box sx={{ maxHeight: 300, overflowY: 'auto', mt: 2 }}>
            {messages.map((msg, index) => (
              <Box key={index} className={`message ${msg.sender}`} sx={{ mb: 2 }}>
                <Paper sx={{ p: 2, backgroundColor: msg.sender === 'bot' ? '#ff6f61' : '#d9d9d9' }}>
                  <Typography variant="body1">{msg.text}</Typography>
                </Paper>
              </Box>
            ))}
            <div ref={messageEndRef} />
          </Box>
          <Box display="flex" alignItems="center" mt={2}>
            <TextField
              fullWidth
              variant="outlined"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyUp={handleKeyPress}
              placeholder="Type your message..."
            />
            {/* <Button
              variant="contained"
              color="primary"
              onClick={handleSendMessage}
              endIcon={<SendIcon />}
              sx={{ ml: 2 }}
            >
              Send
            </Button> */}

            <StyledButton variant="contained" onClick={handleSendMessage} sx={{ ml: 2 }}>
              Send
              <SendIcon />
            </StyledButton>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default Chatbot;
