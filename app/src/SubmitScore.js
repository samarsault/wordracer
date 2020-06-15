import api from './api';
import React, {useState} from 'react';

export default function({ user, score, token, onSuccess, onClose }) {
  const [userName, setUserName] = useState(user)
  const updateUser = (e) => {
    e.preventDefault();
    if (token) {
      // Update Score
      api.put('/score', {
        user,
        token,
        score
      }).then( ({ status }) => {
        if (status === 200) {
          onSuccess({
            user
          })
        } else {
          alert('Error')
        }
      })
    } else {
      api.post('/score', { user: userName, score }).then(({ status, data }) => {
        if (status === 200) {
          localStorage.setItem('token', data.token);
          onSuccess({
            user: data.user
          })
        }
      });
    }
  }
  return (
    <div>
      <form onSubmit={ updateUser }>
        <p>Congrats!</p>
        <h1 style={{  fontSize: 70 } }>{ score }</h1>
        <input type="text" value={ userName } onChange={ (e) => setUserName(e.target.value) } readOnly={token ? 1 : 0 }/>
        <button>Done</button>
      </form>
    </div>
  )
}
