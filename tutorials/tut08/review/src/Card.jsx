import React from 'react';
import './Card.css';

export default ({ avatar_url, name, url }) => (
    <div className="card">
        <img src={avatar_url} alt={name} style={{ width: '50px', height: '50px' }}/>
        <a href={url}>{name}</a>
    </div>
)
