import React, { Component } from "react";

class UploadMedia extends Component {
  _onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      var name = e.target.files[0].name;
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        const result = reader.result;

        this.props.handleResponse(name, result);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  render() {
    return (
      <div style={{ textAlign: "center", padding: 16 }}>
        <input type="file" accept="*" onChange={this._onSelectFile} />
      </div>
    );
  }
}

export default UploadMedia;
