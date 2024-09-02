import React, {useState, useEffect} from 'react';

const TimeDisplay = () => {
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        // Fetch the current time from an API (you can replace this with an actual API)
        // For demonstration purposes, we'll just set a static time here.
        const fetchCurrentTime = async () => {
            try {
                // Replace this with your actual API call to get the current time
                const response = await fetch('https://worldtimeapi.org/api/timezone/Asia/Tehran');
                const data = await response.json();
                const {datetime} = data;
                setCurrentTime(datetime);
            } catch (error) {
                console.error('Error fetching time:', error);
            }
        };

        fetchCurrentTime();
        // Refresh the time every second
        const intervalId = setInterval(fetchCurrentTime, 1000);

        // Clean up the interval when the component unmounts
        return () => clearInterval(intervalId);


    }, []);

    // Parse the received datetime string
    const parsedDate = new Date(currentTime);
    const date = parsedDate.toLocaleString('fa-IR', {timeZone: 'Asia/Tehran'}).split(' ')[0].split(',')[0];
    const time = parsedDate.toLocaleString('fa-IR', {timeZone: 'Asia/Tehran'}).split(' ')[1];

    return (
        <div style={{
            display: "flex",
            flexDirection: "row-reverse",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "IranSans",
            fontSize: "0.8rem",
            color: "white",
            margin: "0.1rem",
            padding: "0.2rem 0.5rem",
            borderRadius: "0.35rem",
            minWidth: "10rem",
            backgroundColor: "rgba(0, 0, 0, 0.5)"
        }}>
            <span>{`${time} : ${date}`}</span>
            <span></span>
        </div>
    );
};

export default TimeDisplay;
