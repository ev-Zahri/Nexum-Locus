// eslint-disable-next-line no-unused-vars
import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Carousel from "./components/Carousel";

const App = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
                <div className="relative">
                    {/* Gambar Full-Size */}
                    <img
                        src="https://via.placeholder.com/1920x600"
                        alt="Banner"
                        className="w-full h-96 object-cover"
                    />
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
                        <h1 className="text-4xl text-white font-bold">Welcome to Ticket Dashboard</h1>
                    </div>
                </div>
                <section className="my-8">
                    <h2 className="text-2xl font-bold text-center mb-6">Upcoming Events</h2>
                    <Carousel />
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default App;
