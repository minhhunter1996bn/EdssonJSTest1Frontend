import React, { Component } from "react";

import axios from "axios";

class DisplayLayout extends Component {
    render() {
        console.log(this.props)
        return (
            <div>{
                this.props.columns.map((rowsColItem) => {
                    { console.log(rowsColItem.type) }
                    {
                        if (rowsColItem.type == 'field') {
                            <div>rowsColItem.type</div>
                        } else {
                            <div>
                                <input type={rowsColItem.type}>{rowsColItem.label}</input>
                            </div>;
                        }
                    }
                    <div>{rowsColItem.fieldId}</div>;
                })
            }</div>
        )
    }
}
export default DisplayLayout;