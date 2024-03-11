import React, { Component } from "react";

class PrivacyPolicyPage extends Component {
    
    
    render() {
        const html = '<h1>Privacy Policy</h1> <p>Last updated: June 23, 2022</p><p>This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.</p><h1>Interpretation and Definitions</h1>';
        // let content = require(`./privacy-policy.html`);
        return (
            <div>{html}</div>
            
        );
    }

}


export default (PrivacyPolicyPage)