const { useState, useEffect, useRef } = React
import i18next from "i18next";
import { Clock } from "./clock";
import { getNearestCity }  from "./geo-helper";

export { ClockCollection };

const ClockCollection = (props) => {
    const [idCounter, setIdCounter] = useState(0);
    const idCounterRef = useRef(idCounter);
    const [addedTimeZones, setAddedTimeZones] = useState([{
        id: idCounter,
        location: {
            city: props.defaultCity,
            country: props.defaultCountry,
            timezone: props.defaultTimezone
        }
    }]);
    const [defaultLocation, setDefaultLocation] = useState(({
        city: props.defaultCity,
        country: props.defaultCountry,
        timezone: props.defaultTimezone,
    }));
    const [date, setDate] = useState(new Date());
    const [isModelChanged, setIsModelChanged] = useState(false);
    const isModelChangedRef = useRef(isModelChanged);

    useEffect(() => {
        isModelChangedRef.current = isModelChanged;
        idCounterRef.current = idCounter;
    });

    useEffect(() => {
        setDate(new Date());
        const timerID = setInterval(() => setDate(new Date()), 1000);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const cityInfo = getNearestCity(position.coords.latitude, position.coords.longitude);
                if (!isModelChangedRef.current) {
                    setAddedTimeZones([{
                        id: idCounterRef,
                        location: cityInfo.location
                    }]);
                }
    
                setDefaultLocation(cityInfo.location);
            });
        }

        return () => {
            clearInterval(timerID);
        };
    }, []);

    function onClockAdded(id) {
        const newIdCounter = idCounter + 1;
        setIdCounter(newIdCounter);
        setAddedTimeZones((prev) => {
            const index = prev.findIndex((element) => element.id === id);
            prev.splice(index + 1, 0, {
                id: newIdCounter,
                location: defaultLocation
            });
            return [...prev];
        });
        setIsModelChanged(true);
    }

    function onClockRemove(id) {
        if (addedTimeZones.length === 1) return;
        setAddedTimeZones((prev) => prev.filter((element) => element.id !== id));
        setIsModelChanged(true);
    }

    function onClockChanged() {
        setIsModelChanged(true);
    }

    return <div className="application-container">
        <div className="project-description">
            <div className="container-fluid">
                <div className="row text-center">
                    <div className = "col-lg-4 offset-lg-4 col-md-6 offset-md-3 col-sm-10 offset-sm-1">{i18next.t('Project description')}</div>
                </div>
            </div>
        </div>
        <div className="clock-collection">
        {
            addedTimeZones.map(settings => <Clock key={settings.id}
                id={settings.id}
                city={settings.location.city}
                country={settings.location.country}
                date={date}
                timezone={settings.location.timezone}
                onRemove={onClockRemove}
                onAdd={onClockAdded}
                onChange={onClockChanged}/>)
        }
        </div>
    </div>;
}