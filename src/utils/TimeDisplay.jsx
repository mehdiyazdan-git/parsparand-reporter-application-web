import React, {useEffect, useState} from 'react';

const TimeDisplay = () => {

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000); // Update every second

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, [currentTime]);

    // Parse the datetime
    const parsedDate = new Date(currentTime);
    const date = parsedDate.toLocaleString('fa-IR', { timeZone: 'Asia/Tehran' }).split(' ')[0].split(',')[0];
    const time = parsedDate.toLocaleString('fa-IR', { timeZone: 'Asia/Tehran' }).split(' ')[1];

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