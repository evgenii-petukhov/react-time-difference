const { useState, useEffect } = React
import i18next from "i18next";
import { Clock } from "./clock";
import { getNearestCity }  from "./geo-helper";

export { ClockCollection };

const ClockCollection = (props) => {
    const [idCounter, setIdCounter] = useState(0);
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

    useEffect(() => {
        setDate(new Date());
        const timerID = setInterval(() => setDate(new Date()), 1000);

        new Promise(resolve => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    resolve(getNearestCity(position.coords.latitude, position.coords.longitude));
                });
            }
        }).then(cityInfo => {
            if (addedTimeZones.length === 1 && addedTimeZones[0].location.city === defaultLocation.city) {
                setAddedTimeZones([{
                    id: idCounter,
                    location: cityInfo.location
                }]);
            }

            setDefaultLocation(cityInfo.location);
        });

        return () => {
            clearInterval(timerID);
        };
    }, []);

    function addClock(id) {
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
    }

    function removeClockById(id) {
        if (addedTimeZones.length === 1) return;
        setAddedTimeZones((prev) => prev.filter((element) => element.id !== id));
    }

    return <div className="application-container">
        <div className="project-description">
            <div className="container-fluid">
                <div className="row text-center">
                    <div className = "col-lg-4offset-lg-4 col-md-6 offset-md-3 col-sm-10 offset-sm-1">{i18next.t('Project description')}</div>
                </div>
            </div>
        </div>
        <div className="clock-collection">
        {
            addedTimeZones.map(settings => <Clock key={settings.id}
                id={settings.id}
                city={settings.location.city}
                country={settings.location.country}
                timezone={settings.location.timezone}
                removeCallback={removeClockById}
                addCallback={addClock}
                date={date} />)
        }
        </div>
    </div>;
}