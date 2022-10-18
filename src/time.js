const { useState, useEffect } = React

export { Time };

const Time = (props) => {
    const [date, setDate] = useState(new Date());
    const [timerID, setTimerID] = useState(0);
    const [timezone, setTimezone] = useState(props.timezone);

    useEffect(() => {
        if (timerID === 0) {
            setTimeout(() => {
                setDate(new Date());
                setTimerID(setInterval(() => setDate(new Date()), 1000));
            }, 1000 - new Date().getMilliseconds());
        }
        setTimezone(props.timezone);
    });

    return <div>{date.toLocaleTimeString([], { timeZone: timezone, hour12: false })}</div>;
}