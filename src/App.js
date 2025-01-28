import React, { useState, useEffect, useCallback } from 'react';
import './styles/styles.css';

const WhatsAppClone = () => {
  const [instanceId, setInstanceId] = useState('');
  const [apiToken, setApiToken] = useState('');
  const [contacts, setContacts] = useState([]); // Список контактов
  const [currentContact, setCurrentContact] = useState(''); // Текущий выбранный контакт
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [authorized, setAuthorized] = useState(false);

  const GREEN_API_BASE = 'https://api.green-api.com/waInstance';

  const handleLogin = () => {
    if (instanceId && apiToken) {
      setAuthorized(true);
    }
  };

  const sendMessage = async () => {
    if (!newMessage || !currentContact) return;

    try {
      const response = await fetch(
        `${GREEN_API_BASE}${instanceId}/sendMessage/${apiToken}`, 
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chatId: `${currentContact}@c.us`,
            message: newMessage
          })
        }
      );

      if (response.ok) {
        setMessages(prev => [...prev, { 
          text: newMessage, 
          sender: 'me', 
          timestamp: new Date() 
        }]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Ошибка отправки сообщения', error);
    }
  };

  const receiveMessages = useCallback(async () => {
    try {
      const response = await fetch(
        `https://api.green-api.com/waInstance${instanceId}/receiveNotification/${apiToken}`
      );
      
      if (!response.ok) {
        throw new Error('Ошибка при получении уведомления');
      }

      const notification = await response.json();
      console.log('Получено уведомление:', notification);

      if (notification && notification.body) {
        const messageType = notification.body.typeWebhook;
        console.log('Тип уведомления:', messageType);

        if (messageType === 'incomingMessageReceived') {
          const senderNumber = notification.body.senderData.sender.split('@')[0];
          console.log('Номер отправителя:', senderNumber, 'Текущий контакт:', currentContact);

          // Проверяем, соответствует ли отправитель текущему контакту
          if (currentContact && senderNumber === currentContact) {
            const messageData = notification.body.messageData;
            console.log('Данные сообщения:', messageData);

            if (messageData.typeMessage === 'textMessage') {
              const newMsg = {
                text: messageData.textMessageData.textMessage,
                sender: 'contact',
                timestamp: new Date()
              };
              console.log('Новое сообщение:', newMsg);
              setMessages(prev => [...prev, newMsg]);
            }
          }
        }

        if (notification.receiptId) {
          const deleteUrl = `https://api.green-api.com/waInstance${instanceId}/deleteNotification/${apiToken}/${notification.receiptId}`;
          await fetch(deleteUrl, { method: 'DELETE' });
          console.log('Уведомление удалено:', notification.receiptId);
        }
      }
    } catch (error) {
      console.error('Ошибка получения сообщений:', error);
    }
  }, [instanceId, apiToken, currentContact]);

  useEffect(() => {
    let intervalId;
    if (authorized && currentContact) {
      intervalId = setInterval(receiveMessages, 5000);
      console.log('Запущено получение сообщений для контакта:', currentContact);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        console.log('Остановлено получение сообщений');
      }
    };
  }, [authorized, currentContact, receiveMessages]);

  const addContact = () => {
    const newContact = prompt('Введите номер телефона нового контакта (например: 79991234567):');
    if (newContact && !contacts.includes(newContact)) {
      setContacts(prev => [...prev, newContact]);
      if (!currentContact) {
        setCurrentContact(newContact); // Автоматически выбираем новый контакт, если текущий не выбран
      }
    }
  };

  const deleteContact = (contactToDelete) => {
    const updatedContacts = contacts.filter(contact => contact !== contactToDelete);
    setContacts(updatedContacts);

    // Если удаляется текущий контакт, выбираем следующий или предыдущий
    if (contactToDelete === currentContact) {
      const currentIndex = contacts.indexOf(contactToDelete);
      if (updatedContacts.length > 0) {
        const newCurrentContact = updatedContacts[currentIndex] || updatedContacts[currentIndex - 1];
        setCurrentContact(newCurrentContact);
      } else {
        setCurrentContact('');
      }
      setMessages([]); // Очищаем сообщения
    }
  };

  const selectContact = (contact) => {
    setCurrentContact(contact);
    setMessages([]); // Очищаем сообщения при смене контакта
  };

  const switchContact = (direction) => {
    const currentIndex = contacts.indexOf(currentContact);
    if (direction === 'prev' && currentIndex > 0) {
      setCurrentContact(contacts[currentIndex - 1]);
      setMessages([]);
    } else if (direction === 'next' && currentIndex < contacts.length - 1) {
      setCurrentContact(contacts[currentIndex + 1]);
      setMessages([]);
    }
  };

  return (
    <div className="container">
      {!authorized ? (
        <div className="login-card">
          <h2>Вход в Green API</h2>
          <input 
            className="input-field"
            placeholder="ID инстанса" 
            value={instanceId}
            onChange={(e) => setInstanceId(e.target.value)}
          />
          <input 
            className="input-field"
            placeholder="API токен" 
            type="password"
            value={apiToken}
            onChange={(e) => setApiToken(e.target.value)}
          />
          <button 
            className="button"
            onClick={handleLogin}
          >
            Войти
          </button>
        </div>
      ) : (
        <div className="chat-card">
          <div className="chat-header">
            <h2>WhatsApp Чат</h2>
          </div>
          <div className="chat-body">
            <div className="contacts-list">
              <button onClick={addContact} className="button add-contact-button">
                + Добавить контакт
              </button>
              {contacts.map((contact, index) => (
                <div
                  key={index}
                  className={`contact ${contact === currentContact ? 'active' : ''}`}
                >
                  <span onClick={() => selectContact(contact)}>
                    {contact}
                  </span>
                  <button 
                    className="delete-contact-button"
                    onClick={() => deleteContact(contact)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="chat-messages">
              <div className="contact-navigation">
                <button 
                  className="nav-button"
                  onClick={() => switchContact('prev')}
                  disabled={contacts.indexOf(currentContact) <= 0}
                >
                  ◀
                </button>
                <div className="current-contact">
                  Чат с: {currentContact || 'Выберите контакт'}
                </div>
                <button 
                  className="nav-button"
                  onClick={() => switchContact('next')}
                  disabled={contacts.indexOf(currentContact) >= contacts.length - 1}
                >
                  ▶
                </button>
              </div>
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`message ${msg.sender === 'me' ? 'sent' : 'received'}`}
                >
                  {msg.text}
                  <small className="message-time">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </small>
                </div>
              ))}
            </div>
            <div className="message-input">
              <input 
                className="input-field message-input-field"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Введите сообщение"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button 
                className="button send-button"
                onClick={sendMessage}
              >
                Отправить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppClone;