window.React = window.React ?? require('react');
const { useState, useEffect } = React;

const Time = (props) => {
    const [timeSetByUser, setTimeSetByUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [localizedTimeString, setLocalizedTimeString] = useState(null);

    useEffect(() => {
        if (!props.date || !props.timezone) {
            return;
        }
        const timeString = getLocaleTimeString(props.date, props.timezone);
        setLocalizedTimeString(timeString);
        if (!isEditing) {
            setTimeSetByUser(timeString.substring(0, 5));
        }
    }, [props.date, props.timezone]);

    function switchMode() {
        if (isEditing) {
            const currentTimeChunks = parseTimeString(localizedTimeString);
            const newTimeChunks = parseTimeString(timeSetByUser);

            if (currentTimeChunks && newTimeChunks) {
                const delta = ((newTimeChunks.hours - currentTimeChunks.hours) * 3600 + (newTimeChunks.minutes - currentTimeChunks.minutes) * 60) * 1000;
                props.updateTimeDelta?.(delta);
            }
        }
        setIsEditing(!isEditing);
    }

    function onTextChanged(e) {
        setTimeSetByUser(e.target.value);
    }

    function parseTimeString(timeString) {
        const timeChunks = timeString.split(':');
        if (timeChunks.length > 1) {
            const hours = parseInt(timeChunks[0]);
            const minutes = parseInt(timeChunks[1]);
            return hours >=0 && hours <= 24 && minutes >= 0 && minutes <= 59 ? {
                hours,
                minutes
            } : null;
        } else {
            return null;
        }
    }

    function getLocaleTimeString(date, timezone) {
        return date.toLocaleTimeString([], {
            timeZone: timezone,
            hour12: false
        });
    }

    function onKeyDown(e) {
        if (e.which === 27) { // Esc
            setIsEditing(!isEditing);
        }
    }

    return props.date && props.timezone && <div className="time">
        <div className="time-value-container">
            <div className="time-value-inner-container">
                {
                    isEditing
                        ? <div className="time-editable">
                            <input type="text"
                                autoFocus
                                value={timeSetByUser}
                                onChange={onTextChanged}
                                onKeyDown={onKeyDown}/>
                        </div>
                        : <div className="time-readonly">{getLocaleTimeString(props.date, props.timezone)}</div>
                }
            </div>
        </div>
        <div className="time-control-container">
            <button className="btn btn-light" onClick={switchMode}><i className={`bi bi-${isEditing ? 'check-lg' : 'pencil'}`}></i></button>
        </div>
    </div>;
}

export default Time;