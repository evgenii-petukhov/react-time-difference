const { useState, useEffect, useRef } = React;
import i18next from "i18next";
import { Clock } from "./clock";
import { getNearestCity }  from "../helpers/geo-helper";
import { searchPhotos } from "../helpers/pexels-helper";
import { downloadAndEncodeToBase64 } from "../helpers/base64-helper";

export { ClockCollection };

const ClockCollection = (props) => {
    const [idCounter, setIdCounter] = useState(0);
    const idCounterRef = useRef(idCounter);
    const [addedTimeZones, setAddedTimeZones] = useState([{
        id: idCounter,
        images: null,
        location: {
            city: props.defaultCity,
            country: props.defaultCountry,
            timezone: props.defaultTimezone,
            iso2: props.defaultIso2
        }
    }]);
    const [defaultLocation, setDefaultLocation] = useState({
        city: props.defaultCity,
        country: props.defaultCountry,
        timezone: props.defaultTimezone,
        iso2: props.defaultIso2
    });
    const [defaultImages, setDefaultImages] = useState(null);
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
        loadDefaultImages(idCounterRef.current, defaultLocation);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const cityInfo = getNearestCity(position.coords.latitude, position.coords.longitude);
                setDefaultLocation(cityInfo.location);
                loadDefaultImages(idCounterRef.current, cityInfo.location);
            });
        }

        return () => {
            clearInterval(timerID);
        };
    }, []);

    function loadDefaultImages(id, location) {
        searchPhotos(location.country).then(urls => {
            Promise.allSettled(urls.map(url => downloadAndEncodeToBase64(url))).then(results => {
                const blobs = results.filter(r => r.status === 'fulfilled').map(r => r.value);
                setDefaultImages(blobs);
                if (!isModelChangedRef.current) {
                    setAddedTimeZones(() => [{
                        id,
                        images: blobs,
                        location: {
                            city: location.city,
                            country: location.country,
                            timezone: location.timezone,
                            iso2: location.iso2
                        }
                    }]);
                }
            }).catch(() => setDefaultImages(null));
        });
    }

    function onClockAdded(id) {
        const newIdCounter = idCounter + 1;
        setIdCounter(newIdCounter);
        setAddedTimeZones((prev) => {
            const index = prev.findIndex((element) => element.id === id);
            prev.splice(index + 1, 0, {
                id: newIdCounter,
                images: defaultImages,
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

    function onClockChanged(id, location) {
        const prev = [...addedTimeZones];
        const index = prev.findIndex(el => el.id === id);
        prev[index].location = location;
        setAddedTimeZones(prev);
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
                location={settings.location}
                images={settings.images}
                date={date}
                onRemove={onClockRemove}
                onAdd={onClockAdded}
                onChange={onClockChanged}/>)
        }
        </div>
    </div>;
}