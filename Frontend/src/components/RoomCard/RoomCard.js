import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./RoomCard.css";

const RoomCard = ({ room }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/room/${room.room_id}`);
    };

    return (
        <div className="room-pick-card" onClick={handleClick}>
            <img src={room.image} alt={room.title} className="room-image" />
            <span className="room-desc"> {room.no_of_beds} Beds , {room.no_of_baths} Baths </span>
            <div className="room-details">
                <div className="room-title">{room.room_name} - {room.room_type}</div>
                <div className="room-datetime">
                    <span className="room-date">${room.price}</span>
                    <span className="room-desc">Max:{room.max_guests}</span>
                </div>
            </div>
            <div className="room-info">
                <div className="room-desc">{room.about}</div>
            </div>
        </div >
    );
};

export default RoomCard;