const { useState, useEffect } = React;

export { Time };

const Time = (props) => {
    const [state, setState] = useState(props);

    useEffect(() => {
        setState(props);
    });

    return <div>{state.date.toLocaleTimeString([], { timeZone: state.timezone, hour12: false })}</div>;
}