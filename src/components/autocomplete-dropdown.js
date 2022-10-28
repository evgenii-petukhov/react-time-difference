const { useState, useEffect } = React;

const AutocompleteDropdown = (props) => {
    const [suggestions, setSuggestions] = useState([]);
    const [text, setText] = useState(props.text);
    const [location, setLocation] = useState(props.location);
    const [isChangedManually, setIsChangedManually] = useState(false);

    useEffect(() => {
        if (!isChangedManually) {
            setLocation(props.location);
            setText(props.text);
        }
    }, [props.location, props.text]);

    function onTextChanged(e) {
        const value = e.target.value.toUpperCase();

        setSuggestions(value.length ? props.getItems(value).sort() : []);
        setIsChangedManually(true);
        setText(e.target.value);
    }

    function onKeyDown(e) {
        switch (e.which) {
            case 27:
                selectSuggestion('');
                break;
            case 9:
            case 13:
                if (suggestions.length) {
                    selectSuggestion(suggestions[0]);
                }
                break;
        }
    }

    function selectSuggestion(item) {
        setSuggestions([]);
        setLocation(item.location);
        setText(item.location.city);
        props.onTimezoneChanged?.(item.location);
    }

    function renderSuggestions() {
        return suggestions.length === 0 ? null : (
            <ul>
                {
                    suggestions.map((item, index) => <li key={index} onClick={() => selectSuggestion(item)}>
                        <div className="timezone-flag">{item.location.iso2 && <span className={`fi fi-${item.location.iso2.toString().toLowerCase()}`}></span>}</div>
                        <div className="timezone-label">{item.label}</div>
                        <div className="timezone-diff">{item.diff}</div>
                    </li>)
                }
            </ul>
        );
    }

    return <div className="autocomplete-textbox-component">
        <div className="textbox-container">
            <div className="input-group mb-3">
                <span className="input-group-text">
                    {
                        location.iso2 && <span className={`fi fi-${location.iso2.toString().toLowerCase()}`} title={location.country}></span>
                    }
                </span>
                <input type="text"
                    className="form-control"
                    value={text}
                    placeholder={props.placeholder}
                    onChange={onTextChanged}
                    onKeyDown={onKeyDown}
                    onFocus={(e) => e.target.select()} />
            </div>
        </div>
        <div className="suggestions">
            {renderSuggestions()}
        </div>
    </div>;
}

export default AutocompleteDropdown;