const { useState, useEffect, useRef } = React;
import { t } from "i18next";
import Clock from "./clock";
import { getNearestCity } from "../helpers/geo-helper";
import downloadPhotos from "../helpers/pexels-helper";

const ClockCollection = (props) => {
    const idCounterRef = useRef(0);
    const [defaultLocation, setDefaultLocation] = useState({
        city: props.defaultCity,
        country: props.defaultCountry,
        timezone: props.defaultTimezone,
        iso2: props.defaultIso2
    });
    const [timezones, setTimezones] = useState([{
        id: idCounterRef.current,
        images: null,
        location: defaultLocation
    }]);
    const [defaultImages, setDefaultImages] = useState(null);
    const [date, setDate] = useState(new Date());
    const timeDeltaRef = useRef(0);
    const isModelChangedRef = useRef(false);

    useEffect(() => {
        const timerID = setInterval(() => updateDate(timeDeltaRef.current), 1000);
        loadDefaultImages(defaultLocation.country).then(blobs => {
            resetTimezonesUnlessModelChanged(blobs, defaultLocation);
        }).then(() => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    const cityInfo = getNearestCity(position.coords.latitude, position.coords.longitude);
                    setDefaultLocation(cityInfo.location);
                    loadDefaultImages(cityInfo.location.country).then(blobs => {
                        resetTimezonesUnlessModelChanged(blobs, cityInfo.location);
                    });
                });
            }
        });

        return () => {
            clearInterval(timerID);
        };
    }, []);

    function resetTimezonesUnlessModelChanged(images, location) {
        if (!isModelChangedRef.current) {
            setTimezones(() => [{
                id: idCounterRef.current,
                images: images,
                location: location
            }]);
        }
    }

    async function loadDefaultImages(country) {
        return await downloadPhotos(country, bs => setDefaultImages(bs));
    }

    function onClockAdded(id) {
        idCounterRef.current = idCounterRef.current + 1;
        setTimezones((prev) => {
            const index = prev.findIndex((element) => element.id === id);
            prev.splice(index + 1, 0, {
                id: idCounterRef.current,
                images: defaultImages,
                location: defaultLocation
            });
            return [...prev];
        });
        isModelChangedRef.current = true;
    }

    function onClockRemove(id) {
        if (timezones.length === 1) return;
        setTimezones((prev) => prev.filter((element) => element.id !== id));
        isModelChangedRef.current = true;
    }

    function onClockChanged(id, location) {
        const prev = [...timezones];
        const index = prev.findIndex(el => el.id === id);
        prev[index].location = location;
        setTimezones(prev);
        isModelChangedRef.current = true;
    }

    function updateTimeDelta(delta) {
        timeDeltaRef.current = timeDeltaRef.current + delta;
        updateDate(delta);
    }

    function updateDate(delta) {
        setDate(new Date(new Date().getTime() + delta));
    }

    return <div className="application-container">
        <div className="project-description">
            <div className="container-fluid">
                <div className="row text-center">
                    <div className="col-lg-4 offset-lg-4 col-md-6 offset-md-3 col-sm-10 offset-sm-1">{t('Project description')}</div>
                </div>
            </div>
        </div>
        <div className="clock-collection">
            {
                timezones.map(settings => <Clock key={settings.id}
                    id={settings.id}
                    location={settings.location}
                    images={settings.images}
                    date={date}
                    onRemove={onClockRemove}
                    onAdd={onClockAdded}
                    onChange={onClockChanged}
                    updateTimeDelta={updateTimeDelta} />)
            }
        </div>
    </div>;
}

export default ClockCollection;