window.React = window.React ?? require('react');
const { useState, useEffect } = React;
import { t } from "i18next";

const AutocompleteDropdown = (props) => {
    const [model, setModel] = useState({
        suggestions: [],
        text: props.text,
        location: props.location,
        isChangedManually: false
    });

    useEffect(() => {
        if (!model.isChangedManually) {
            setModel((prev) => {
                return {...prev,                 
                    location: props.location,
                    text: props.text
                };
            });
        }
    }, [props.location, props.text]);

    function onTextChanged(e) {
        const value = e.target.value.toLocaleUpperCase();

        setModel((prev) => {
            return {...prev,
                suggestions: value.length ? props.getItems?.(value) : [],
                isChangedManually: true,
                text: e.target.value
            };

        });
    }

    function onKeyDown(e) {
        switch (e.which) {
            case 27: // Esc
                setModel((prev) => {
                    return {
                        ...prev,
                        suggestions: [],
                        text: props.text
                    };
                });
                break;
            case 9: // Tab
            case 13: // Enter
                if (model.suggestions.length) {
                    selectSuggestion(model.suggestions[0]);
                }
                break;
        }
    }

    function selectSuggestion(item) {
        setModel((prev) => {
            return {...prev,
                suggestions: [],
                location: item.location,
                text: item.location.city
            };
        });
        props.onTimezoneChanged?.(item.location);
    }

    function renderSuggestions() {
        return (model.suggestions && model.suggestions.length) ? (
            <ul>
                {
                    model.suggestions.map((item, index) => <li key={index} onClick={() => selectSuggestion(item)}>
                        <div className="timezone-flag">{item.location.iso2 && <span className={`fi fi-${item.location.iso2.toString().toLowerCase()}`}></span>}</div>
                        <div className="timezone-label">{item.label}</div>
                        <div className="timezone-diff">{`${item.diff > 0 ? '+' : ''}${item.diff}${t('h')}`}</div>
                    </li>)
                }
            </ul>
        ) : null;
    }

    return <div className="autocomplete-textbox-component">
        <div className="textbox-container">
            <div className="input-group">
                <span className="input-group-text">
                    {
                        model.location?.iso2 && <span className={`fi fi-${model.location.iso2.toString().toLowerCase()}`} title={model.location.country}></span>
                    }
                </span>
                <input type="text"
                    className="form-control"
                    value={model.text}
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