const { useState, useEffect } = React;

export { Time };

const Time = (props) => {
    const [timeSetByUser, setTimeSetByUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [localizedDateString, setLocalizedDateString] = useState(null);

    useEffect(() => {
        const dateString = getLocaleTimeString();
        setLocalizedDateString(dateString);
        if (!isEditing) {
            setTimeSetByUser(dateString.substring(0, 5));
        }
    });

    function changeMode() {
        if (isEditing) {
            const { hours, minutes } = parseDateString(localizedDateString);
            const { hours: hoursSetByUser, minutes: minutesSetByUser } = parseDateString(timeSetByUser);

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
        const dateChunks = dateString.split(':');
        return dateChunks.length > 1 ? {
            hours: parseInt(dateChunks[0]),
            minutes: parseInt(dateChunks[1])
        } : {
            hours: 0,
            minutes: 0
        };
    }

    function getLocaleTimeString() {
        return props.date.toLocaleTimeString([], { timeZone: props.timezone, hour12: false });
    }

    return <div className="time">
        <div className="time-value-container">
            <div className="time-value-inner-container">
                {
                    isEditing
                        ? <div className="time-editable">
                            <input size="2" type="text" value={timeSetByUser} onChange={onTextChanged} />
                        </div>
                        : <div className="time-readonly">{getLocaleTimeString()}</div>
                }
            </div>
        </div>
        <div className="time-control-container">
            <button className="btn btn-light" onClick={changeMode}><i className={`bi bi-${isEditing ? 'check-lg' : 'pencil'}`}></i></button>
        </div>
    </div>;
}