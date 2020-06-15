import React from 'react';

export default function({ scores }) {
  return (
    <div id="leaderboard">
        { 
          scores.map(
            (score, index) => (
              <div className="leader-item" key={index}>
                <div className="leader-rank">{ index + 1 }</div>
                <div className="leader-user">{ score.user }</div>
                <div className="leader-score">{ score.score }</div>
              </div>
            )
          )
        }
    </div>
  )
}
