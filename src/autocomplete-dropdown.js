const { useState, useEffect } = React

export { AutocompleteDropdown }

const AutocompleteDropdown = (props) => {
    const [suggestions, setSuggestions] = useState([]);
    const [text, setText] = useState(props.text);
    const [isChangedManually, setIsChangedManually] = useState(false);

    useEffect(() => {
        if (!isChangedManually) {
            setText(props.text);
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
        setText(item.label);
        props.onTimezoneChanged?.(item.label, item.location);
    }

    function renderSuggestions() {
        return suggestions.length === 0 ? null : (
            <ul>
                {suggestions.map((item, index) => <li key={index} onClick={() => selectSuggestion(item)}>
                    <div className="timezone-label">{item.label} <span className={`fi fi-${item.location.iso2.toLowerCase()}`}></span></div>
                    <div className="timezone-diff">{item.diff}</div>
                </li>)}
            </ul>
        );
    }

    return <div className="autocomplete-textbox-component">
        <div className="textbox-container">
            <input type="text"
                className="form-control"
                value={text}
                placeholder={props.placeholder}
                onChange={onTextChanged}
                onKeyDown={onKeyDown}
                onFocus={(e) => e.target.select()} />
        </div>
        <div className="suggestions">
            {renderSuggestions()}
        </div>
    </div>;
}