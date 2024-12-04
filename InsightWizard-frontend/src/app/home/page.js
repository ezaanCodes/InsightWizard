//
'use client'
import React, { useState } from 'react';
import Layout from '../components/Layout';
import styles from './home.module.css';
import chatStyles from './chat.module.css';

export default function Home() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Add user message to the chat
    setMessages([...messages, { text: input, type: 'user' }]);
    
    try {
      const res = await fetch('http://localhost:8123/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input }),
      });
      
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await res.json();
      // Add response message to the chat
      setMessages([...messages, { text: input, type: 'user' }, { text: data.answer, type: 'assistant' }]);
    } catch (err) {
      setError('An error occurred while fetching the data');
      console.error(err);
    } finally {
      setLoading(false);
      setInput(''); // Clear the input field
    }
  };

  return (
    <Layout>
      <div className={styles.main}>
        <div className={`${styles.headerBar}`}>
          <button className={styles.toggleButton} onClick={toggleSidebar}>
            <img src="/hamburger-icon.png" alt="Toggle Sidebar" className={styles.hamburgerIcon} />
          </button>
          <img src="/logo.svg" alt="Docinsight Logo" className={styles.logo} />
        </div>

        {sidebarVisible && (
          <section className={styles.sidebar}>
            <input className={styles.search} type="text" placeholder="Search history" />
            <ul className={styles.historyList}>
              <li>Write about seven world wonders...</li>
              <li>What is the best way to manage...</li>
              <li>Tell me an easy recipe to make...</li>
              <li>Best places to visit on earth after...</li>
              <li>Best feature of Android...</li>
              <li>Hex code of different shades of blue...</li>
            </ul>
            <button className={styles.logoutButton}>Logout</button>
          </section>
        )}
        
        <section className={`${chatStyles.chatContent} ${!sidebarVisible ? styles.contentExpanded : ''}`}>
          {/* Display chat messages */}
          {messages.map((msg, index) => (
            <div key={index} className={msg.type === 'user' ? styles.chatMessage : styles.chatResponse}>
              <p>{msg.text}</p>
            </div>
          ))}

          {/* Handle loading state */}
          {loading && <p>Loading...</p>}
          
          {/* Handle error state */}
          {error && <p className={styles.error}>{error}</p>}
        </section>

        
        {/* className={styles.promptContainer} */}
        <div className={styles.promptContainer} >
          <div className="flex w-full flex-col gap-1.5 rounded-[26px] p-1.5 transition-colors bg-[#f4f4f4] dark:bg-token-main-surface-secondary">
            
              <form onSubmit={handleSubmit} className='flex items-end gap-1.5 md:gap-2'>
                <button className={styles.uploadButton}>
                  <img src="/paperclip-icon.png" alt="Upload" />
                </button>
                <div className='"flex min-w-0 flex-1 flex-col"'>
                  <input 
                    className="m-0 resize-none border-0 bg-transparent px-0 text-token-text-primary " 
                    type="text" 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    placeholder="Enter a Prompt here" 
                  />
                </div>
                
                <button type="submit" className={styles.sendButton}>
                  <img src="/arrow-icon.png" alt="Send" />
                </button>
              </form>
           
            
          </div>
        </div>
        

        <footer className={styles.footer}>
          <p className={styles.disclaimer}>
            The solutions provided here are for reference only, not instructions to perform.
            <br />
            Use your training and judgment to execute solutions....
          </p>
        </footer>
      </div>
    </Layout>
  );
}