const { useState, useEffect } = React;

export { Time };

const Time = (props) => {
    const [timeSetByUser, setTimeSetByUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [localizedDateString, setLocalizedDateString] = useState(null);

    useEffect(() => {
        const dateString = props.date.toLocaleTimeString([], { timeZone: props.timezone, hour12: false });
        setLocalizedDateString(dateString);
        if (!isEditing) {
            setTimeSetByUser(dateString.substring(0, 5));
        }
    });

    function changeMode() {
        if (isEditing) {
            const {hours, minutes} = parseDateString(localizedDateString);
            const {hours: hoursSetByUser, minutes: minutesSetByUser} = parseDateString(timeSetByUser);

            const delta = ((hoursSetByUser - hours) * 3600 + (minutesSetByUser - minutes) * 60) * 1000;
            props.updateTimeDelta?.(delta);
        }
        setIsEditing(!isEditing);
    }

    function onTextChanged(e) {
        const value = e.target.value;
        setTimeSetByUser(value);
    }

    function parseDateString(dateString) {
        return {
            hours: parseInt(dateString.substring(0, 2)),
            minutes: parseInt(dateString.substring(3, 5))
        };
    }

    return <div className="time">
        <div className="time-value-container">
            {
                isEditing
                    ? <div className="time-editable">
                        <input size="2" type="text" value={timeSetByUser} onChange={onTextChanged} />
                    </div>
                    : <div className="time-readonly">{props.date.toLocaleTimeString([], { timeZone: props.timezone, hour12: false })}</div>
            }
        </div>
        <div className="time-control-container">
            <button className="btn btn-light" onClick={changeMode}><i className={`bi bi-${isEditing ? 'check-lg' : 'pencil'}`}></i></button>
        </div>
    </div>;
}