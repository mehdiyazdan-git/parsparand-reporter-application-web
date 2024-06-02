import React from 'react';
import {Tooltip as ReactTooltip} from "react-tooltip";

const Tooltip = ({
                     id,
                     place = "left",
                     content,
                     backgroundColor = "rgba(125,125,125,0.4)",
                     color = "green",
                     fontFamily = "IRANSans"
                 }) => {
    return (
        <ReactTooltip
            id={id}
            place={place}
            effect="solid"
            style={{
                backgroundColor:backgroundColor,
                color:color,
                fontFamily:fontFamily,
            }}
        >
            {content}
        </ReactTooltip>
    );
};

export default Tooltip;
