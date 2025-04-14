import React, { useState } from 'react';
import './App.css';
import githubLogo from './assets/github-logo.svg';

function App() {
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!username.trim()) return;
    
    setLoading(true);
    setError(null);
    setUser(null);
    
    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      
      if (!response.ok) {
        throw new Error(
          response.status === 404 
            ? 'Usuário não encontrado' 
            : 'Erro ao buscar perfil'
        );
      }
      
      const data = await response.json();
      setUser(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <img src={githubLogo} alt="GitHub Logo" className="github-logo" />
          <h1 className="title">Perfil GitHub</h1>
        </header>
        
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nickname"
            className="search-input"
            aria-label="Nome do usuário GitHub"
          />
          <button type="submit" className="search-button" disabled={loading}>
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              <span className="search-icon">🔍</span>
            )}
          </button>
        </form>
        
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner large"></div>
            <p>Buscando perfil...</p>
          </div>
        )}
        
        {error && (
          <div className="error-container">
            <p className="error-message">{error}</p>
          </div>
        )}
        
        {user && (
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-image-container">
                <img src={user.avatar_url} alt={`${user.login} avatar`} className="profile-image" />
              </div>
              
              <h2 className="profile-name">
                <a href={user.html_url} target="_blank" rel="noopener noreferrer">
                  {user.name || user.login}
                </a>
              </h2>
            </div>
            
            {user.bio && (
              <p className="profile-bio">{user.bio}</p>
            )}
            
            <div className="profile-stats">
              <div className="stat">
                <span className="stat-value">{user.followers}</span>
                <span className="stat-label">Seguidores</span>
              </div>
              <div className="stat">
                <span className="stat-value">{user.following}</span>
                <span className="stat-label">Seguindo</span>
              </div>
              <div className="stat">
                <span className="stat-value">{user.public_repos}</span>
                <span className="stat-label">Repos</span>
              </div>
            </div>
            
            {user.location && (
              <p className="profile-location">📍 {user.location}</p>
            )}
            
            {user.blog && (
              <p className="profile-website">
                <a href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`} 
                   target="_blank" 
                   rel="noopener noreferrer">
                  🔗 Website
                </a>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;