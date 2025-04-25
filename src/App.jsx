import React, { useState } from 'react';
import './App.css';
import githubLogo from './assets/github-logo.svg';
import searchIcon from './assets/search-icon.svg';

function App() {
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const errorMessages = {
    notFound: 'Nenhum perfil foi encontrado com ese nome de usuário.',
    tryAgain: 'Tente novamente',
    generic: 'Erro ao buscar perfil.',
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const trimmedUsername = username.trim();

    if (!trimmedUsername) return;

    setLoading(true);
    setError(null);
    setUser(null);

    try {
      const response = await fetch(`https://api.github.com/users/${trimmedUsername}`);

      if (!response.ok) {
        setError(
          response.status === 404
            ? `${errorMessages.notFound} ${errorMessages.tryAgain}`
            : `${errorMessages.generic} (Status: ${response.status})`
        );
        throw new Error(`API Error ${response.status}`);
      }

      const data = await response.json();

      setUser({
        name: data.name || data.login,
        avatar_url: data.avatar_url,
        bio: data.bio,
      });

    } catch (fetchError) {
      console.error("GitHub API Fetch Error:", fetchError);
      if (!error) {
        setError(errorMessages.generic);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderErrorMessage = () => {
    if (!error) return null;

    if (error.includes(errorMessages.notFound) && error.includes(errorMessages.tryAgain)) {
      return (
        <>
          <p className="error-message">{errorMessages.notFound}</p>
          <p className="error-message">{errorMessages.tryAgain}</p>
        </>
      );
    }

    return <p className="error-message">{error}</p>;
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <img src={githubLogo} alt="GitHub Logo" className="github-logo" />
          <div className="title-container">
             <h1>
                <span className="title-perfil">Perfil</span>
                <span className="title-github">GitHub</span>
             </h1>
          </div>
        </header>

        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Digite um usuário do Github"
            className="search-input"
            aria-label="Nome do usuário GitHub"
            disabled={loading}
          />
          <button
            type="submit"
            className="search-button"
            disabled={loading || !username.trim()}
          >
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              <img src={searchIcon} alt="Buscar" className="search-icon-svg" />
            )}
          </button>
        </form>

        <div className="result-area">
          {error && !loading && (
            <div className="error-display">
              {renderErrorMessage()}
            </div>
          )}

          {user && !loading && !error && (
            <div className="user-profile">
              <div className="profile-image-container">
                <img
                  src={user.avatar_url}
                  alt={`Avatar de ${user.name}`}
                  className="profile-image"
                />
              </div>
              <div className="profile-info">
                 <h2 className="profile-name">{user.name}</h2>
                 {user.bio && (
                   <p className="profile-bio">{user.bio} 🚀</p>
                 )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
