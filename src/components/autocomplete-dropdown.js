const { useState, useEffect } = React;

export { AutocompleteDropdown };

const AutocompleteDropdown = (props) => {
    const [suggestions, setSuggestions] = useState([]);
    const [text, setText] = useState(props.text);
    const [country, setCountry] = useState(props.country);
    const [iso2, setIso2] = useState(props.iso2);
    const [isChangedManually, setIsChangedManually] = useState(false);

    useEffect(() => {
        if (!isChangedManually) {
            setText(props.text);
            setCountry(props.country);
            setIso2(props.iso2);
        }
    });

    function onTextChanged(e) {
        const value = e.target.value.toUpperCase();

        setSuggestions(value.length > 0
            ? props.getItems(value).sort()
            : []);

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
                if (suggestions.length > 0) {
                    selectSuggestion(suggestions[0]);
                }
                break;
        }
    }

    function selectSuggestion(item) {
        setSuggestions([]);
        setText(item.location.city);
        setCountry(item.location.country);
        setIso2(item.location.iso2);
        props.onTimezoneChanged?.(item.location);
    }

    function renderSuggestions() {
        return suggestions.length === 0 ? null : (
            <ul>
                {suggestions.map((item, index) => <li key={index} onClick={() => selectSuggestion(item)}>
                    <div className="timezone-flag">{item.location.iso2 && <span className={`fi fi-${item.location.iso2.toString().toLowerCase()}`}></span>}</div>
                    <div className="timezone-label">{item.label}</div>
                    <div className="timezone-diff">{item.diff}</div>
                </li>)}
            </ul>
        );
    }

    return <div className="autocomplete-textbox-component">
        <div className="textbox-container">
            <div className="input-group mb-3">
                <span className="input-group-text">
                    {iso2 && <span className={`fi fi-${iso2.toString().toLowerCase()}`}
                        title={country}></span>}
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