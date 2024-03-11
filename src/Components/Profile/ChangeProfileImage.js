/* globals window, document, FileReader */
import React, { Component } from 'react';
import { Done } from '@material-ui/icons';
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css';
import {
    base64StringtoFile,
    extractImageFileExtensionFromBase64,
    MESSAGE_PROFILE_UPDATE_FAILURE,
    TITLE_FAILURE
} from "../../common";
import Fab from "@material-ui/core/es/Fab/Fab";
import { MessageDialog, ProgressDialog } from "../Dialogs";
import { changeProfileImage } from "../../Store/actions";
import { connect } from "react-redux";

// import './custom-image-crop.css'

/**
 * Load the image in the crop editor.
 */
//const cropEditor = document.querySelector('#crop-editor');

class ChangeProfileImage extends Component {
    constructor(props) {
        super(props);
        this.imagePreviewCanvasRef = React.createRef();
    }

    state = {
        openMessageDialog: false,
        imgSrc: null,
        imgSrcExt: null,
        crop: {
            x: 10,
            y: 10,
            aspect: 1,
            width: 300,
        },
    };

    onSelectFile = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                const imgResult = reader.result;
                this.setState({
                    imgSrc: imgResult,
                    imgSrcExt: extractImageFileExtensionFromBase64(imgResult)
                });
            });
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    onImageLoaded = (image) => {
        this.imageRef = image;
        this.makeClientCrop(this.state.crop);
    };

    onCropComplete = (crop) => {
        // console.log('onCropComplete', crop);
        this.makeClientCrop(crop);
    };

    onCropChange = (crop) => {
        // console.log('onCropChange', crop);
        this.setState({
            crop: crop,
            showSave: false
        });
    };

    onDragStart = () => {
        // console.log('onDragStart');
    };

    onDragEnd = () => {
        // console.log('onDragEnd');
    };

    uploadImage = () => {
        const myFilename = "previewFile." + this.state.imgSrcExt;

        // file to be uploaded
        const myNewCroppedFile = base64StringtoFile(this.state.base64Data, myFilename);
        // console.log(myNewCroppedFile);

        this.props.changeImage(myNewCroppedFile);

        if (this.props.employeeImage === '') {
            this.title = TITLE_FAILURE;
            this.message = MESSAGE_PROFILE_UPDATE_FAILURE;
            this.setState({
                openSnackbar: true
            });
        } else {
            this.props.handleResponse();
        }
    };

    getCroppedImg(image, crop) {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height,
        );

        return new Promise((resolve) => {
            // console.log(resolve);
            let base64Data = canvas.toDataURL('image/' + this.state.imgSrcExt);
            // console.log(base64Data);
            resolve(base64Data);

            /*canvas.toBlob((blob) => {
                blob.name = fileName; // eslint-disable-line no-param-reassign
                window.URL.revokeObjectURL(this.fileUrl);
                this.fileUrl = window.URL.createObjectURL(blob);
                console.log(this.fileUrl);
                resolve(this.fileUrl);
            }, 'image/jpeg');*/
        });
    }

    makeClientCrop(crop) {
        if (this.imageRef && crop.width && crop.height) {
            this.getCroppedImg(
                this.imageRef,
                crop
            ).then(base64Data => this.setState({ base64Data }));
        }
    }

    renderSelectionAddon = () => (
        <Fab
            variant="contained"
            color='secondary'
            style={{
                position: 'inherit',
                bottom: 10,
                right: 10
            }}
            onClick={() => this.uploadImage()}

        >
            <Done />
        </Fab>);

    render() {
        /*const {base64Data} = this.state;*/

        return (
            <div style={{ textAlign: 'center' }}>
                <div style={{ padding: 16 }}>
                    <input type="file" accept="image/*" onChange={this.onSelectFile} />
                </div>

                {this.state.imgSrc && (
                    <ReactCrop
                        /*style={{maxWidth: '50%'}}*/
                        src={this.state.imgSrc}
                        crop={this.state.crop}
                        onImageLoaded={this.onImageLoaded}
                        onComplete={this.onCropComplete}
                        onChange={this.onCropChange}
                        onDragStart={this.onDragStart}
                        onDragEnd={this.onDragEnd}
                        renderSelectionAddon={this.renderSelectionAddon}
                    />
                )}
                {/*{base64Data && <img alt="Crop" src={base64Data}/>}*/}
                <ProgressDialog open={this.props.isFetching} />
                <MessageDialog title={this.title} message={this.message}
                    openMessageDialog={this.state.openMessageDialog}
                    closeMessageDialog={() => {
                        this.setState({ openSnackbar: false })
                    }} />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isFetching: state.usr.isFetching,
        employeeImage: state.usr.employeeImage
    }
};

const mapDispatchToProps = dispatch => {
    return {
        changeImage: (imgFile) => dispatch(changeProfileImage(imgFile))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangeProfileImage);