import React, { useState, useEffect } from 'react';
import { Bell, Search, Plus, ChevronUp, ChevronDown, Check, X, User, Calendar, Tag, MessageCircle, Eye, Edit, Trash2, Bold, Italic, Underline, List, ListOrdered, Link, Image, AlignLeft, AlignCenter, AlignRight, Smile } from 'lucide-react';

const StackIt = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentView, setCurrentView] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [users, setUsers] = useState([
    { id: 1, username: 'john_doe', email: 'john@example.com', role: 'user' },
    { id: 2, username: 'jane_smith', email: 'jane@example.com', role: 'user' },
    { id: 3, username: 'admin', email: 'admin@stackit.com', role: 'admin' }
  ]);

  // Sample data
  useEffect(() => {
    const sampleQuestions = [
      {
        id: 1,
        title: 'How to implement JWT authentication in React?',
        description: '<p>I am building a React application and need to implement <strong>JWT authentication</strong>. What is the best approach?</p><ul><li>Should I store JWT in localStorage?</li><li>How to handle token expiration?</li></ul>',
        tags: ['React', 'JWT', 'Authentication'],
        author: 'john_doe',
        createdAt: new Date('2024-01-15'),
        votes: 5,
        answers: [
          {
            id: 1,
            content: '<p>Here is a comprehensive approach to JWT authentication in React:</p><ol><li><strong>Store JWT securely</strong> - Use httpOnly cookies instead of localStorage</li><li><strong>Handle token refresh</strong> - Implement automatic token refresh</li><li><strong>Protect routes</strong> - Use React Router guards</li></ol>',
            author: 'jane_smith',
            createdAt: new Date('2024-01-15'),
            votes: 8,
            accepted: true
          }
        ]
      },
      {
        id: 2,
        title: 'Best practices for React component optimization?',
        description: '<p>What are the most effective ways to optimize React components for better performance?</p>',
        tags: ['React', 'Performance', 'Optimization'],
        author: 'jane_smith',
        createdAt: new Date('2024-01-14'),
        votes: 3,
        answers: []
      }
    ];
    setQuestions(sampleQuestions);
  }, []);

  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ username: '', email: '', password: '' });
  const [questionForm, setQuestionForm] = useState({ title: '', description: '', tags: [] });
  const [answerForm, setAnswerForm] = useState({ content: '' });
  const [tagInput, setTagInput] = useState('');

  // Authentication
  const handleLogin = (e) => {
    e.preventDefault();
    const user = users.find(u => u.username === loginForm.username);
    if (user) {
      setCurrentUser(user);
      setCurrentView('home');
      setLoginForm({ username: '', password: '' });
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const newUser = {
      id: users.length + 1,
      username: registerForm.username,
      email: registerForm.email,
      role: 'user'
    };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    setCurrentView('home');
    setRegisterForm({ username: '', email: '', password: '' });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('home');
  };

  // Question management
  const handleAskQuestion = (e) => {
    e.preventDefault();
    if (!currentUser) return;
    
    const newQuestion = {
      id: questions.length + 1,
      title: questionForm.title,
      description: questionForm.description,
      tags: questionForm.tags,
      author: currentUser.username,
      createdAt: new Date(),
      votes: 0,
      answers: []
    };
    
    setQuestions([newQuestion, ...questions]);
    setQuestionForm({ title: '', description: '', tags: [] });
    setCurrentView('home');
  };

  const handleAddAnswer = (e) => {
    e.preventDefault();
    if (!currentUser || !selectedQuestion) return;
    
    const newAnswer = {
      id: selectedQuestion.answers.length + 1,
      content: answerForm.content,
      author: currentUser.username,
      createdAt: new Date(),
      votes: 0,
      accepted: false
    };
    
    const updatedQuestions = questions.map(q => 
      q.id === selectedQuestion.id 
        ? { ...q, answers: [...q.answers, newAnswer] }
        : q
    );
    
    setQuestions(updatedQuestions);
    setAnswerForm({ content: '' });
    
    // Add notification
    addNotification(`${currentUser.username} answered your question: "${selectedQuestion.title}"`);
    
    // Update selected question
    setSelectedQuestion({ ...selectedQuestion, answers: [...selectedQuestion.answers, newAnswer] });
  };

  const handleVote = (type, questionId, answerId = null) => {
    if (!currentUser) return;
    
    const updatedQuestions = questions.map(q => {
      if (q.id === questionId) {
        if (answerId) {
          return {
            ...q,
            answers: q.answers.map(a => 
              a.id === answerId 
                ? { ...a, votes: a.votes + (type === 'up' ? 1 : -1) }
                : a
            )
          };
        } else {
          return { ...q, votes: q.votes + (type === 'up' ? 1 : -1) };
        }
      }
      return q;
    });
    
    setQuestions(updatedQuestions);
    if (selectedQuestion) {
      setSelectedQuestion(updatedQuestions.find(q => q.id === questionId));
    }
  };

  const handleAcceptAnswer = (questionId, answerId) => {
    if (!currentUser) return;
    
    const updatedQuestions = questions.map(q => {
      if (q.id === questionId && q.author === currentUser.username) {
        return {
          ...q,
          answers: q.answers.map(a => ({ ...a, accepted: a.id === answerId }))
        };
      }
      return q;
    });
    
    setQuestions(updatedQuestions);
    setSelectedQuestion(updatedQuestions.find(q => q.id === questionId));
  };

  const addNotification = (message) => {
    const newNotification = {
      id: notifications.length + 1,
      message,
      createdAt: new Date(),
      read: false
    };
    setNotifications([newNotification, ...notifications]);
  };

  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  // Tag management
  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!questionForm.tags.includes(tagInput.trim())) {
        setQuestionForm({
          ...questionForm,
          tags: [...questionForm.tags, tagInput.trim()]
        });
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setQuestionForm({
      ...questionForm,
      tags: questionForm.tags.filter(tag => tag !== tagToRemove)
    });
  };

  // Text editor functions
  const applyFormat = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  // Filter questions
  const filteredQuestions = questions.filter(q =>
    q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const unreadNotifications = notifications.filter(n => !n.read);

  // Render components
  const renderLogin = () => (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Login to StackIt</h2>
      <div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
          <input
            type="text"
            value={loginForm.username}
            onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input
            type="password"
            value={loginForm.password}
            onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Login
        </button>
      </div>
      <p className="text-center mt-4 text-gray-600">
        Don't have an account?{' '}
        <button
          onClick={() => setCurrentView('register')}
          className="text-blue-600 hover:underline"
        >
          Register here
        </button>
      </p>
    </div>
  );

  const renderRegister = () => (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Register for StackIt</h2>
      <div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
          <input
            type="text"
            value={registerForm.username}
            onChange={(e) => setRegisterForm({...registerForm, username: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={registerForm.email}
            onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input
            type="password"
            value={registerForm.password}
            onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          onClick={handleRegister}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Register
        </button>
      </div>
      <p className="text-center mt-4 text-gray-600">
        Already have an account?{' '}
        <button
          onClick={() => setCurrentView('login')}
          className="text-blue-600 hover:underline"
        >
          Login here
        </button>
      </p>
    </div>
  );

  const renderTextEditor = (content, setContent) => (
    <div className="border border-gray-300 rounded-md">
      <div className="flex flex-wrap gap-2 p-2 border-b border-gray-300 bg-gray-50">
        <button
          type="button"
          onClick={() => applyFormat('bold')}
          className="p-1 rounded hover:bg-gray-200"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => applyFormat('italic')}
          className="p-1 rounded hover:bg-gray-200"
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onClick={() => applyFormat('underline')}
          className="p-1 rounded hover:bg-gray-200"
        >
          <Underline size={16} />
        </button>
        <button
          type="button"
          onClick={() => applyFormat('insertUnorderedList')}
          className="p-1 rounded hover:bg-gray-200"
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={() => applyFormat('insertOrderedList')}
          className="p-1 rounded hover:bg-gray-200"
        >
          <ListOrdered size={16} />
        </button>
        <button
          type="button"
          onClick={() => applyFormat('justifyLeft')}
          className="p-1 rounded hover:bg-gray-200"
        >
          <AlignLeft size={16} />
        </button>
        <button
          type="button"
          onClick={() => applyFormat('justifyCenter')}
          className="p-1 rounded hover:bg-gray-200"
        >
          <AlignCenter size={16} />
        </button>
        <button
          type="button"
          onClick={() => applyFormat('justifyRight')}
          className="p-1 rounded hover:bg-gray-200"
        >
          <AlignRight size={16} />
        </button>
      </div>
      <div
        contentEditable
        className="p-3 min-h-[120px] focus:outline-none"
        dangerouslySetInnerHTML={{ __html: content }}
        onBlur={(e) => setContent(e.target.innerHTML)}
        onInput={(e) => setContent(e.target.innerHTML)}
      />
    </div>
  );

  const renderAskQuestion = () => (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Ask a Question</h2>
      <div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input
            type="text"
            value={questionForm.title}
            onChange={(e) => setQuestionForm({...questionForm, title: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Short and descriptive title"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          {renderTextEditor(questionForm.description, (content) => 
            setQuestionForm({...questionForm, description: content})
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {questionForm.tags.map(tag => (
              <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={handleAddTag}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add tags (press Enter to add)"
          />
        </div>
        <button
          onClick={handleAskQuestion}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Post Question
        </button>
      </div>
    </div>
  );

  const renderQuestionDetail = () => (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="flex items-start gap-4 mb-6">
        <div className="flex flex-col items-center">
          <button
            onClick={() => handleVote('up', selectedQuestion.id)}
            className="p-1 rounded hover:bg-gray-200"
          >
            <ChevronUp size={20} />
          </button>
          <span className="text-lg font-semibold">{selectedQuestion.votes}</span>
          <button
            onClick={() => handleVote('down', selectedQuestion.id)}
            className="p-1 rounded hover:bg-gray-200"
          >
            <ChevronDown size={20} />
          </button>
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">{selectedQuestion.title}</h1>
          <div className="prose max-w-none mb-4" dangerouslySetInnerHTML={{ __html: selectedQuestion.description }} />
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedQuestion.tags.map(tag => (
              <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <User size={16} />
              {selectedQuestion.author}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={16} />
              {selectedQuestion.createdAt.toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">
          {selectedQuestion.answers.length} Answer{selectedQuestion.answers.length !== 1 ? 's' : ''}
        </h3>
        
        {selectedQuestion.answers.map(answer => (
          <div key={answer.id} className="flex items-start gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex flex-col items-center">
              <button
                onClick={() => handleVote('up', selectedQuestion.id, answer.id)}
                className="p-1 rounded hover:bg-gray-200"
              >
                <ChevronUp size={20} />
              </button>
              <span className="text-lg font-semibold">{answer.votes}</span>
              <button
                onClick={() => handleVote('down', selectedQuestion.id, answer.id)}
                className="p-1 rounded hover:bg-gray-200"
              >
                <ChevronDown size={20} />
              </button>
              {currentUser && currentUser.username === selectedQuestion.author && (
                <button
                  onClick={() => handleAcceptAnswer(selectedQuestion.id, answer.id)}
                  className={`p-1 rounded mt-2 ${answer.accepted ? 'text-green-600' : 'hover:bg-gray-200'}`}
                >
                  <Check size={20} />
                </button>
              )}
            </div>
            <div className="flex-1">
              {answer.accepted && (
                <div className="mb-2 text-green-600 font-semibold">✓ Accepted Answer</div>
              )}
              <div className="prose max-w-none mb-2" dangerouslySetInnerHTML={{ __html: answer.content }} />
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <User size={16} />
                  {answer.author}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={16} />
                  {answer.createdAt.toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}

        {currentUser && (
          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-4">Your Answer</h4>
            <div>
              {renderTextEditor(answerForm.content, (content) => 
                setAnswerForm({...answerForm, content})
              )}
              <button
                onClick={handleAddAnswer}
                className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Post Answer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderQuestionList = () => (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">All Questions</h2>
        {currentUser && (
          <button
            onClick={() => setCurrentView('ask')}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={16} />
            Ask Question
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        {filteredQuestions.map(question => (
          <div key={question.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center text-sm text-gray-600">
                <span className="font-semibold">{question.votes}</span>
                <span>votes</span>
              </div>
              <div className="flex flex-col items-center text-sm text-gray-600">
                <span className="font-semibold">{question.answers.length}</span>
                <span>answers</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">
                  <button
                    onClick={() => {
                      setSelectedQuestion(question);
                      setCurrentView('question');
                    }}
                    className="text-blue-600 hover:text-blue-800 text-left"
                  >
                    {question.title}
                  </button>
                </h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  {question.tags.map(tag => (
                    <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <User size={16} />
                    {question.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={16} />
                    {question.createdAt.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setCurrentView('home')}
                className="text-2xl font-bold text-blue-600 hover:text-blue-800"
              >
                StackIt
              </button>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-96 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {currentUser && (
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 rounded-full hover:bg-gray-100"
                  >
                    <Bell size={20} />
                    {unreadNotifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadNotifications.length}
                      </span>
                    )}
                  </button>
                  
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border max-h-96 overflow-y-auto z-50">
                      <div className="p-4 border-b">
                        <h3 className="font-semibold">Notifications</h3>
                      </div>
                      {notifications.length === 0 ? (
                        <div className="p-4 text-gray-500 text-center">No notifications</div>
                      ) : (
                        notifications.map(notification => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                              !notification.read ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => markNotificationAsRead(notification.id)}
                          >
                            <p className="text-sm">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {notification.createdAt.toLocaleString()}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}
              
              {currentUser ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">
                    Welcome, {currentUser.username}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentView('login')}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setCurrentView('register')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {currentView === 'home' && renderQuestionList()}
        {currentView === 'login' && renderLogin()}
        {currentView === 'register' && renderRegister()}
        {currentView === 'ask' && renderAskQuestion()}
        {currentView === 'question' && renderQuestionDetail()}
      </main>
    </div>
  );
};

export default StackIt;