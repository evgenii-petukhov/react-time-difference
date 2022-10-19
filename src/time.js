const { useState, useEffect } = React

export { Time };

const Time = (props) => {
    const [date, setDate] = useState(new Date());
    const [timezone, setTimezone] = useState(props.timezone);

    useEffect(() => {
        setDate(props.date);
        setTimezone(props.timezone);
    });

    return <div>{date.toLocaleTimeString([], { timeZone: timezone, hour12: false })}</div>;
}