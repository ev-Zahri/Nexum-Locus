// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";

const Carousel = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        // Simulasi API fetch
        const fetchEvents = async () => {
            const mockData = [
                { id: 1, title: "Concert A", image: "https://via.placeholder.com/200" },
                { id: 2, title: "Concert B", image: "https://via.placeholder.com/200" },
                { id: 3, title: "Concert C", image: "https://via.placeholder.com/200" },
            ];
            setEvents(mockData);
        };
        fetchEvents();
    }, []);

    return (
        <div className="flex overflow-x-auto space-x-4 px-4">
            {events.map((event) => (
                <div
                    key={event.id}
                    className="w-48 bg-gray-100 rounded-lg shadow-md overflow-hidden"
                >
                    <img src={event.image} alt={event.title} className="w-full h-32 object-cover" />
                    <div className="p-2">
                        <h3 className="text-lg font-semibold">{event.title}</h3>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Carousel;
